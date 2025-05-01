import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ActivityCalendar } from 'react-activity-calendar'
import type { Activity } from 'react-activity-calendar'
import React from 'react'
import './index.css'
const CalendarHeatMap: React.FC<{ data: Activity[] }> = ({ data }) => {
  const customTheme = {
    light: ['hsl(0,0%,92%)', '#0ac740']
  }
  return (
    <div className='heatmap'>
      <ActivityCalendar
        showWeekdayLabels
        data={data}
        theme={customTheme}
        labels={{
          totalCount: '{{year}} 年有 {{count}} 贡献'
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html': `${activity.count} 贡献 ${activity.date}`,
          })
        }
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  )
}

export default CalendarHeatMap
