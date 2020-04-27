import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface PropType {
  select: (start: number, end: number) => void;
}

type Area = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const Wrapper = styled.div<{ start: boolean }>`
  height: calc(100% - 24px);
  margin: 0 -50px;
  position: relative;

  .tableBodyCon {
    margin: 0 50px 50px 50px;
    max-height: 100%;
    overflow-y: auto;
  }

  .ant-checkbox-group {
    width: 100%;
    z-index: 99;
    position: relative;
    pointer-events: ${(props) => (props.start ? 'none' : 'all')};
  }

  .tableBodyBg {
    height: calc(100% + 50px);
    width: calc(100%);
    position: absolute;
    top: 0;
    z-index: 9;

    .area.active {
      position: absolute;
      background-color: rgba(29, 165, 122, 0.1);
      border: solid 1px rgba(29, 165, 122, 0.8);
      pointer-events: none;
    }
  }
`;

const Files: React.FC<PropType> = (props) => {
  const { children, select } = props;
  const wrapperRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const conRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const [conHeight, setConHeight] = useState<number>(0);
  const [conWidth, setConWidth] = useState<number>(0);

  const [top, setTop] = useState<number>(100);
  const [left, setLeft] = useState<number>(100);
  const [bottom, setBottom] = useState<number>(100);
  const [right, setRight] = useState<number>(100);

  const [start, setStart] = useState<Area | undefined>(undefined);

  const mouseEvent = {
    start: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target !== wrapperRef.current) return;
      const topNow = (e.nativeEvent.offsetY / conHeight) * 100;
      const leftNow = (e.nativeEvent.offsetX / conWidth) * 100;
      setStart({
        top: topNow,
        bottom: 100 - topNow,
        left: leftNow,
        right: 100 - leftNow,
      });
      setTop(topNow);
      setBottom(100 - topNow);
      setLeft(leftNow);
      setRight(100 - leftNow);
    },
    move: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!start) return;
      if (e.buttons !== 1) {
        setStart(undefined);
        return;
      }
      const topNow = (e.nativeEvent.offsetY / conHeight) * 100;
      const leftNow = (e.nativeEvent.offsetX / conWidth) * 100;

      if (topNow < start.top) {
        setTop(topNow);
      } else {
        setBottom(100 - topNow);
      }

      if (leftNow < start.left) {
        setLeft(leftNow);
      } else {
        setRight(100 - leftNow);
      }
      mouseEvent.calculate();
    },

    end: () => {
      setTop(0);
      setLeft(0);
      setBottom(0);
      setRight(0);
      setStart(undefined);
    },

    calculate: () => {
      const offset = conRef.current.scrollTop;
      const startTop = (top * conHeight) / 100;
      const startBottom = Math.min(
        ((100 - bottom) * conHeight) / 100,
        conHeight - 40,
      );
      select(offset + startTop, offset + startBottom);
    },

    preventDefault: (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
  };

  useEffect(() => {
    const height = wrapperRef.current.clientHeight;
    const width = wrapperRef.current.clientWidth;
    setConHeight(height);
    setConWidth(width);
  }, []);

  return (
    <Wrapper start={!!start}>
      <div
        className="tableBodyBg"
        ref={wrapperRef}
        onMouseMove={mouseEvent.move}
        onMouseDown={mouseEvent.start}
        onMouseUp={mouseEvent.end}
      >
        {start && (
          <div
            className="area active"
            style={{
              top: top + '%',
              left: left + '%',
              right: right + '%',
              bottom: bottom + '%',
            }}
          ></div>
        )}
      </div>
      <div className="tableBodyCon" ref={conRef}>
        {children}
      </div>
    </Wrapper>
  );
};

export default Files;
