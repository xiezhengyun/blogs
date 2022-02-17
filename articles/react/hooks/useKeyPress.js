import { useEffect, useState, useRef } from 'react';

// domNode default to document.body
const useKeyPress = (domNode = document.body) => {
  const [key, setKey] = useState(null);
  useEffect(() => {
    const handleKeyPress = evt => {
      setKey(evt.key);
    };
    domNode.addEventListener('keypress', handleKeyPress);
    return () => {
      domNode.removeEventListener('keypress', handleKeyPress);
    };
  }, [domNode]);
  return key;
};

// 在键盘按键的例子中，我们只是实现了单个按键的监听，如果我们要实现同时两个按键的监听呢？比如同时按下 A 和 B，那么用 Hooks 怎么去比较好的实现？

// 1. 使用数组存值；
// 2. keydown存值； 
// 3. 当keyup表示单键或者组合键按键结束，清空数组；
// 4.当长按键不放会多次触发事件，所以setKey时需要去重
function useKeyPress3(dom = document.body) {
  const [key, setKey] = useState([]);
  const isNext = useRef(true); // 当keyup之后，isNext置为true表示又是新一轮的按键监听
  useEffect(() => {
    const handleKeyPress = e => {
      if (e.type === 'keydown') {
        if (isNext.current) setKey([]);
        setKey(keys => [...new Set([...keys, e.key])]); // 去重
        isNext.current = false;
      } else {
        isNext.current = true;
      }
    };
    dom.addEventListener('keydown', handleKeyPress);
    dom.addEventListener('keyup', handleKeyPress);
    return () => {
      dom.removeEventListener('keydown', handleKeyPress);
      dom.removeEventListener('keydown', handleKeyPress);
    };
  }, [dom]);
  return key.join(',');
}
export default () => {
  const key = useKeyPress3();
  console.log(key);
  return (
    <div>
      <h1>UseKeyPress</h1>
      <label>Key pressed: {key || 'N/A'}</label>
    </div>
  );
};
