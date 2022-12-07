import React from 'react';
import styles from './order-info.less';

export default function OrderInfo(props: any) {
  const timeChange = (event: any) => {
    const time = event.target.value;
    props.onChange('time', time);
  };
  const voltageChange = (event: any) => {
    const v = event.target.value;
    props.onChange('voltage', v);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>1</div>
      <div className={styles.headerRight}>
        <select
          className={styles.select}
          value={props.value.time}
          onChange={timeChange}
        >
          <option value="50">50mm/s</option>
          <option value="25">25mm/s</option>
          <option value="12.5">12.5mm/s</option>
        </select>

        <select
          className={styles.select}
          value={props.value.voltage}
          onChange={voltageChange}
        >
          <option value="2.5">2.5mm/mV</option>
          <option value="5">5mm/mV</option>
          <option value="10">10mm/mV</option>
          <option value="20">20mm/mV</option>
          <option value="40">40mm/mV</option>
        </select>
      </div>
    </div>
  );
}
