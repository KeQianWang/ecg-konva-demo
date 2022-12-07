import styles from './index.less';
import { Stage, Layer, Text, Line, Group, Circle } from 'react-konva';
// @ts-ignore
import { pointsData } from '@/utils/utils';
import OrderInfo from '@/pages/components/order-info';

export default function IndexPage() {
  const scale = 1; // 倍数阈值
  const step = 0.3 * scale; // 波线点间距阈值
  const sampleRate = 500; //采样率（每秒采集数
  const voltage = 0.002; //电压
  // X倍数阈值
  const gridSizeX = 6; //每小格（X轴 0.04/秒，每秒25个
  // Y倍数阈值
  const gridSizeY = 6; //每小格（Y轴 0.1/mv，1mv是2个大格

  const width = ~~(pointsData.length / sampleRate) * 25 * gridSizeX;
  let init = {
    width,
    stageWidth: Math.max(width, window.innerWidth - 10),
    height: 250,
  };

  const configParams = { time: '50', voltage: '20' };

  // 垂直线
  const drawGirdX = () => {
    const width =
      pointsData.length *
      gridSizeX *
      +(init.width / pointsData.length).toFixed(2);
    const height = 180;
    let items = [];
    for (let x = 0, g = 0; x <= width; x += ~~gridSizeX, g++) {
      items.push(
        <Line
          key={x}
          points={[x, 0, x, height]}
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
    const width =
      pointsData.length *
      gridSizeX *
      +(init.width / pointsData.length).toFixed(2);
    const height = 180;
    let items = [];
    for (let y = 0, f = 0; y <= height; y += ~~gridSizeY, f++) {
      items.push(
        <Line
          key={y}
          points={[0, y, width, y]}
          stroke={y % 5 === 0 ? '#ADD5B5' : '#D0E8D5'}
          strokeWidth={1}
          offsetX={-0.5}
        />,
      );
    }
    return items;
  };

  const drawLine = () => {
    let points: any = [];
    const width = init.width;
    let positionX = +(width / pointsData.length).toFixed(2);
    let positionY = voltage * 10 * gridSizeY;
    for (let i = 0; i < pointsData.length; i++) {
      let x = i * positionX;
      let y = 90 - positionY * pointsData[i];
      points.push(x);
      points.push(y);
    }
    return points;
  };

  const handleChange = (type: any, value: any) => {
    if (type === 'time') {
      console.log('time change:', value);
    } else if (type === 'voltage') {
      console.log('voltage change:', value);
    }
  };

  return (
    <div>
      <OrderInfo value={configParams} onChange={handleChange}></OrderInfo>
      <Stage width={init.stageWidth} height={init.height}>
        <Layer>
          <Group name="groupGrid">
            {drawGirdX()}
            {drawGirdY()}
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
