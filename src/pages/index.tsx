import { Stage, Layer, Line, Group, Text,Circle ,Wedge,Rect} from 'react-konva';
// @ts-ignore
import { pointsData,splitData } from '../utils/utils';
import OrderInfo from '@/pages/components/order-info';
import { useState } from 'react';
import * as turf from '@turf/turf'
import _ from 'lodash';

const getPixelValues = (pixelData: any) => {
  let minPixelValue: number = Number.MAX_VALUE;
  let maxPixelValue: number = Number.MIN_VALUE;
  let len = pixelData.length;
  let pixel: number;
  for (let i = 0; i < len; i++) {
    pixel = pixelData[i];
    minPixelValue = minPixelValue < pixel ? minPixelValue : pixel;
    maxPixelValue = maxPixelValue > pixel ? maxPixelValue : pixel;
  }
  return {
    minValue: minPixelValue,
    maxValue: maxPixelValue,
  };
};

export default function IndexPage() {
  const sampleRate = 500; //采样率（每秒采集数
  const voltage = 0.002; //电压
  // X倍数阈值
  const gridSizeX = 6; //每小格（X轴 0.04/秒，每秒25个
  // Y倍数阈值
  const gridSizeY = 6; //每小格（Y轴 0.1/mv，1mv是2个大格
  const [xAxis, setXAxis] = useState(25); // time
  const [yAxis, setYAxis] = useState(10); // voltage
  const [rectPoint, setRectPoint] = useState<any>([]); // voltage

  const totalTime = pointsData.length / sampleRate;
  const { minValue, maxValue } = getPixelValues(pointsData);
  let init = {
    width: xAxis * gridSizeX * totalTime,
    height: Math.max(Math.abs(maxValue), Math.abs(minValue)),
    pxPerMS: (xAxis * gridSizeX) / 10,
    positionY: maxValue,
  };

  // x 刻度线
  const addAxisXText = (index: any, text: any, x: any) => {
    return (
      <Text
        key={index + '_t'}
        text={text + 's'}
        fontStyle={'bold'}
        x={x - 25}
        y={init.height - 4 * gridSizeX - 15}
        width={50}
        align={'center'}
        fill={'#f00'}
      />
    );
  };
  // 垂直线
  const drawGirdX = () => {
    let items = [];
    for (let x = 0, g = 0; x <= init.width; x += ~~gridSizeX, g++) {
      items.push(
        <Line
          key={x}
          points={[x, 0, x, init.height]}
          stroke={g % 5 === 0 ? '#ADD5B5' : '#D0E8D5'}
          strokeWidth={1}
          offsetX={-0.5}
        />,
      );
    }
    return items;
  };
  // 水平线（高度不随着倍数变化
  const drawGirdY = () => {
    let items = [];
    for (let y = 0, f = 0; y <= init.height; y += ~~gridSizeY, f++) {
      items.push(
        <Line
          key={y}
          points={[0, y, init.width, y]}
          stroke={y % 5 === 0 ? '#ADD5B5' : '#D0E8D5'}
          strokeWidth={1}
          offsetX={-0.5}
        />,
      );
    }
    return items;
  };
  // 画尺子
  const drawRulerX = () => {
    let items: any = [];
    for (let x = 0; x <= init.width; x += init.pxPerMS) {
      const isBig = x % (xAxis * gridSizeX) === 0;
      // 刻度
      items.push(
        <Line
          key={x + '_l'}
          points={[
            x,
            init.height,
            x,
            init.height - (isBig ? 4 : 2) * gridSizeX,
          ]}
          strokeWidth={1}
          stroke={'#f00'}
        />,
        isBig && addAxisXText(x, x / xAxis / gridSizeX, x),
      );
    }
    items.push(
      <Line
        key={'rx'}
        points={[0, init.height, init.width, init.height]}
        stroke={'red'}
        strokeWidth={4}
        offsetX={-0.5}
      />,
    );
    return items;
  };
  // 根据坐标画波动
  const xyData:any = []
  const drawLine = () => {
    let points: any = [];
    let positionX = +(init.width / pointsData.length).toFixed(2);
    let positionY = voltage * yAxis * gridSizeY;
    for (let i = 0; i < pointsData.length; i++) {
      let x = i * positionX;
      // 帅哥默认90 改为 init.positionY/2
      let y = init.positionY / 2 - positionY * pointsData[i];
      points.push(x);
      points.push(y);
      xyData.push({
        x:x,
        y:y
      })
      // console.log(xyData,"=====mock数据用xyData======")
    }
    return points;
  };
  // 画矩形
  const drawRectangle = ()=>{
    if(rectPoint.length > 0){
      const fx = rectPoint[0].x
      const ex = rectPoint[rectPoint.length - 1].x
      return (
        <Rect
          x={fx}
          y={0}
          width={ex-fx}
          height={init.height}
          shadowBlur={10}
          stroke={'blue'}
          dash={[10, 5]}
        />
      )
    } else{
      return ""
    }
  }
  // 画三角形
  const drawTriangle = () =>{
    const groupPoint:any = []
    const items:any = []
    splitData.forEach((item:any,index:number) =>{
      const centerX = ( item[0].x+ item[item.length-1].x )/2
      const centerY = 50
      groupPoint.push({ x:centerX,y :centerY});
      items.push(
        <Wedge
          key={index}
          x={centerX}
          y={centerY}
          radius={8}
          fill={'black'}
          stroke={'blackd'}
          strokeWidth={3}
          angle={60}
          rotation={-120}
          onClick={()=>setRectPoint(item)}
        />,
        <Text
          key={index + 'N'}
          text={'N'}
          x={centerX-5}
          y={centerY-35}
          fill={'black'}
          fontSize={15}
        />,
        <Text
          key={index + '_t'}
          text={'68\n883'}
          x={centerX+40}
          y={centerY-25}
          fill={'black'}
          fontSize={15}
        />,
      )
    })
    return items
  }
  const handleChange = (type: any, value: any) => {
    if (type === 'time') {
      setXAxis(+value);
    } else if (type === 'voltage') {
      setYAxis(+value);
    }
  };
  return (
    <div>
      <OrderInfo
        value={{ time: xAxis, voltage: yAxis }}
        onChange={handleChange}
      />
      <Stage width={init.width + 10} height={init.height} x={10}>
        <Layer>
          <Group name="groupGrid">
            {drawGirdX()}
            {drawGirdY()}
            {drawRulerX()}
          </Group>
        </Layer>
        <Layer>
          <Group name='groupTriangle'>
            {drawTriangle()}
            {drawRectangle()}
          </Group>
        </Layer>
        <Layer>
          <Group name="groupLine">
            <Line points={drawLine()} strokeWidth={1} stroke={'#00000'} />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
