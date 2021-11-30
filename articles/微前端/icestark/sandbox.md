# sandbox

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/d4380205063aec2ecdbc507c759ed87747fa7c3d.png)

icestark 实现 JS 沙箱的核心代码。通过 with + new Function 的形式，为子应用脚本创建沙箱运行环境，并通过 Proxy 代理阻断沙箱内对 window 全局变量的访问和修改

```ts
// 监听 路由变化 触发 handleStateChange方法
const hijackHistory = (): void => {
  window.history.pushState = (state: any, title: string, url?: string, ...rest) => {
    originalPush.apply(window.history, [state, title, url, ...rest]);
    const eventName = 'pushState';
    handleStateChange(createPopStateEvent(state, eventName), url, eventName);
  };

  window.history.replaceState = (state: any, title: string, url?: string, ...rest) => {
    originalReplace.apply(window.history, [state, title, url, ...rest]);
    const eventName = 'replaceState';
    handleStateChange(createPopStateEvent(state, eventName), url, eventName);
  };

  window.addEventListener('popstate', urlChange, false);
  window.addEventListener('hashchange', urlChange, false);
};

const handleStateChange = (event: PopStateEvent, url: string, method: RouteType) => {
  setHistoryEvent(event);
  // globalConfiguration.reroute(url, method);
  reroute(url, method);
};

function reroute (url: string, type: RouteType | 'init' | 'popstate'| 'hashchange' ) {
  const { pathname, query, hash } = urlParse(url, true);
  const unmountApps = [];
  const activeApps = [];
  // 对子应用进行分类，需要或不需要加载
  getMicroApps().forEach((microApp: AppConfig) => {
    const shouldBeActive = microApp.checkActive(url);
    if (shouldBeActive) {
      activeApps.push(microApp);
    } else {
      unmountApps.push(microApp);
    }
  });
  Promise.all(
    unmountApps.map(async (unmountApp) => {
      // 已经mounted或正在加载的
      if (unmountApp.status === MOUNTED || unmountApp.status === LOADING_ASSETS) {
        globalConfiguration.onAppLeave(unmountApp);
      }
      await unmountMicroApp(unmountApp.name);
    }).concat(activeApps.map(async (activeApp) => {
      if (activeApp.status !== MOUNTED) {
        globalConfiguration.onAppEnter(activeApp);
      }
      // 创建子应用
      await createMicroApp(activeApp);
    }))
  )
};

async function loadAppModule(appConfig: AppConfig) {
  const appSandbox = createSandbox(appConfig.sandbox);
  const { url, container, entry, entryContent, name } = appConfig;
  // 获取JS和CSS URL 地址，指定或者从HTML里面解析出来
  const appAssets = url ? getUrlAssets(url) : await getEntryAssets({ ... });
  // 加载 JS和CSS资源
  await appendAssets(appAssets, appSandbox);
  lifecycle = {
    mount: getCache(AppLifeCycleEnum.AppEnter),
    unmount: getCache(AppLifeCycleEnum.AppLeave),
  };
  return combineLifecyle(lifecycle, appConfig); // 将子应用的生命周期方法组合返回
}

export async function appendAssets(assets: Assets, sandbox?: Sandbox) {
  // CSS 只是通过 link 标签加载进来，开发需要自己做隔离，比如 CSS Modules
  await loadAndAppendCssAssets(assets);
  // JS 通过内置的沙箱对象隔离
  await loadAndAppendJsAssets(assets, sandbox);
}

export async function loadAndAppendJsAssets(assets: Assets, sandbox?: Sandbox) {
  // 加载所有的 JS URL
  const jsContents = await fetchScripts(jsList);
  // excute code by order
  jsContents.forEach(script => {
    sandbox.execScriptInSandbox(script);
  });
}

class Sandbox {
  private eventListeners = {};
  private timeoutIds: number[] = [];
  private intervalIds: number[] = [];

  constructor(props: SandboxProps = {}) {
    this.sandbox = null;
  }

  execScriptInSandbox(script: string): void {
    this.createProxySandbox();
    // with + Function 组合，形成一个闭包
    // 绑在 sandbox 上
    const execScript = `with (sandbox) {;${script}\n}`;
    const code = new Function('sandbox', execScript).bind(this.sandbox);
    // run code with sandbox
    // sandbox 将代理子应用的 window
    code(this.sandbox);
  }

  createProxySandbox() {
    const proxyWindow = Object.create(null) as Window;
    const originalWindow = window;
    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;
    const originalSetInerval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    // 防止内存泄漏和在切换子应用时候注销掉原来的一些定时或监听事件
    // 需要在外层包一层，将相关的回调存在数组中
    // 待应用切换时候清理
    proxyWindow.addEventListener = (eventName, fn, ...rest) => {
      const listeners = this.eventListeners[eventName] || [];
      listeners.push(fn);
      return originalAddEventListener.apply(originalWindow, [eventName, fn, ...rest]);
    };
    proxyWindow.removeEventListener = (eventName, fn, ...rest) => {
      const listeners = this.eventListeners[eventName] || [];
      if (listeners.includes(fn)) {
        listeners.splice(listeners.indexOf(fn), 1);
      }
      return originalRemoveEventListener.apply(originalWindow, [eventName, fn, ...rest]);
    };
    proxyWindow.setTimeout = (...args) => {
      const timerId = originalSetTimeout(...args);
      this.timeoutIds.push(timerId);
      return timerId;
    };
    // hijack setInterval
    proxyWindow.setInterval = (...args) => {
      const intervalId = originalSetInerval(...args);
      this.intervalIds.push(intervalId);
      return intervalId;
    };

    const sandbox = new Proxy(proxyWindow, {
      set(target: Window, p: PropertyKey, value: any): boolean {

      },
      get(target: Window, p: PropertyKey): any {

      },
      has(target: Window, p: PropertyKey): boolean {
        return p in target || p in originalWindow;
      },
    });
    this.sandbox = sandbox;
  }
  clear() {
    // remove event listeners
    Object.keys(this.eventListeners).forEach((eventName) => {
      (this.eventListeners[eventName] || []).forEach(listener => {
        window.removeEventListener(eventName, listener);
      });
    });
    // clear timeout
    this.timeoutIds.forEach(id => window.clearTimeout(id));
    this.intervalIds.forEach(id => window.clearInterval(id));
  }
}

async function createMicroApp(app: string | AppConfig, appLifecyle?: AppLifecylceOptions) {
  const appConfig = getAppConfigForLoad(app, appLifecyle);
  lifeCycle = await loadAppModule(appConfig);
  // 触发子应用的mount方法
  mountMicroApp(appConfig.name);
}
```
