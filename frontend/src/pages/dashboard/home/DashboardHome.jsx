import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiActivity, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './DashboardHome.module.scss';

// Dummy Data
const revenueData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 8390 },
  { name: 'Sun', value: 10490 },
];

const StatCard = ({ title, value, icon, trend, isPositive }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className={`glass-panel ${styles.statCard}`}
  >
    <div className={styles.statHeader}>
      <span className={styles.statTitle}>{title}</span>
      <div className={styles.iconWrapper}>{icon}</div>
    </div>
    <div className={styles.statBody}>
      <h3 className={styles.statValue}>{value}</h3>
      <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
        {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
        <span>{trend}</span>
      </div>
    </div>
  </motion.div>
);

const MiniChart = () => (
  <div className={`glass-panel ${styles.chartCard}`}>
    <div className={styles.chartHeader}>
      <h4 className={styles.chartTitle}>Revenue Overview</h4>
      <span className={styles.chartSubtitle}>Last 7 days</span>
    </div>
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border)' }}
            itemStyle={{ color: 'var(--primary)' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--primary)" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const DashboardHome = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <StatCard 
          title="Total Revenue" 
          value="$124,563.00" 
          icon={<FiDollarSign />} 
          trend="+14.5%" 
          isPositive={true} 
        />
        <StatCard 
          title="Active Users" 
          value="2,845" 
          icon={<FiUsers />} 
          trend="+3.2%" 
          isPositive={true} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="4.39%" 
          icon={<FiActivity />} 
          trend="-1.4%" 
          isPositive={false} 
        />
      </div>

      <div className={styles.mainGrid}>
        <MiniChart />
        
        <div className={`glass-panel ${styles.recentActivity}`}>
          <h4 className={styles.chartTitle}>Recent Activity</h4>
          <div className={styles.activityList}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>User signed up for Pro plan</p>
                  <span className={styles.activityTime}>2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
