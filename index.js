class Router {
  constructor(config) {
    this.routes = {}; // 消费者模式，将对应路径的执行函数存入一个map里
    this.routeHistory = []; // 路由历史
    this.currentUrl = ""; // 当前的路由地址
    this.currentIndex = -1; // 当前的路由序列号
    this.frontOrBack = false; // 是否的点击前进后退造成的路由变化，此时不需要监听到路由变化函数
    this.callback = config.callback; // 每次路由改变后调用此回调函数，将currentIndex, routeHistory 传出去，将后续依赖路由的操作与路由本身解耦

    this.init();
  }
  static handleBackOrFoward() {
    this.frontOrBack = true;
    this.currentUrl = this.routeHistory[this.currentIndex];
    window.location.hash = this.currentUrl;
  }
  route(path, callback) {
    this.routes[path] = callback || function () {};
  }
  refersh() {
    if (this.frontOrBack) {
      this.frontOrBack = false;
    } else {
      this.currentUrl = window.location.hash.slice(1) || "index";
      this.routeHistory = this.routeHistory.slice(0, this.currentIndex + 1);
      this.routeHistory.push(this.currentUrl);
      this.currentIndex++;
    }

    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
    this.callback(this.currentIndex, this.routeHistory);
  }
  back() {
    if (this.currentIndex > 0) {
      handleBackOrFoward();
      this.currentIndex--;
    }
  }
  forward() {
    const length = window.history.length;
    if (this.currentIndex < length - 1) {
      handleBackOrFoward();
      this.currentIndex++;
    }
  }
  init() {
    window.addEventListener("load", this.refersh.bind(this), false);
    window.addEventListener("hashchange", this.refersh.bind(this), false);
  }
}

const router = new Router({
  callback: (currentIndex, routeHistory) => {
    let backDom = document.querySelector(".nav-area-back");
    if (backDom) {
      if (currentIndex > 0) {
        backDom.classList.add("active");
      } else {
        backDom.classList.remove("active");
      }
    }

    // 如果当前路由后还有路由
    let frontDom = document.querySelector(".nav-area-front");
    if (frontDom) {
      if (currentIndex < routeHistory.length - 1) {
        frontDom.classList.add("active");
      } else {
        frontDom.classList.remove("active");
      }
    }
  },
});

[
  {
    name: "推荐",
    path: "/index",
  },
  {
    name: "排行榜",
    path: "/rank",
  },
  {
    name: "歌单",
    path: "/songList",
  },
  {
    name: "主播电台",
    path: "/broadcast",
  },
  {
    name: "最新音乐",
    path: "/newest",
  },
].forEach((item) =>
  router.route(item.path, () => {
    const tabName = item.path.split("/")[1];
    const tabDom = document.querySelectorAll(".main-box");
    const navDom = document.querySelectorAll(".nav-item");
    const tabDomLength = tabDom.length;
    const navDomLength = navDom.length;
    for (let i = 0; i < tabDomLength; i++) {
      if (tabDom[i].classList.contains(tabName)) {
        tabDom[i].classList.add("main-box-show");
      } else {
        tabDom[i].classList.remove("main-box-show");
      }
    }
    for (let i = 0; i < navDomLength; i++) {
      if (navDom[i].classList.contains(tabName)) {
        navDom[i].classList.add("active");
      } else {
        navDom[i].classList.remove("active");
      }
    }
  })
);
function handleRouterBack() {
  router.back();
}

function handleRouterFront() {
  router.forward();
}
