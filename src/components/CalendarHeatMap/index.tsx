import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ActivityCalendar } from 'react-activity-calendar'
import type { Activity } from 'react-activity-calendar'
import React from 'react'
import './index.css'
const CalendarHeatMap: React.FC<{ data: Activity[] }> = ({ data }) => {
  return (
    <>
      <ActivityCalendar
        showWeekdayLabels
        data={data}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html': `${activity.count} activities on ${activity.date}`,
          })
        }
      />
      <ReactTooltip id="react-tooltip" />
    </>
  )
}

export default CalendarHeatMap
