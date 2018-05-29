import React from 'react'
import PropTypes from 'prop-types'
import { ART, Platform } from 'react-native'

const { Surface, Shape, Path, Group } = ART

var OFFSET =  20 

function createPath(cx, cy, r, startAngle, arcAngle) {
  const p = new Path()
  p.path.push(0, cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
  p.path.push(4, cx, cy, r, startAngle, startAngle + arcAngle, 1)
  return p
}

const ArcShape = ({ radius, width, color, startAngle, arcAngle }) => {
  const path = createPath(
    radius,
    radius,
    radius - width / 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI
  )
  return <Shape d={path} stroke={color} strokeWidth={width} strokeCap="butt" />
}

const ArcShape2 = ({ radius, width, color, startAngle, arcAngle }) => {
  const path = createPath(
    radius+OFFSET,
    radius+OFFSET,
    radius - width/ 2,
    startAngle / 180 * Math.PI,
    arcAngle / 180 * Math.PI
  )
  return <Shape d={path} stroke={color} strokeWidth={width} strokeCap="butt" />
}

const RingShape = props =>
  Platform.OS === 'ios'
    ? <ArcShape {...props} startAngle={0} arcAngle={360} />
    : <Group>
        <ArcShape {...props} startAngle={0} arcAngle={180} />
        <ArcShape {...props} startAngle={180} arcAngle={180} />
      </Group>

const RingShape2 = props =>
Platform.OS === 'ios'
  ? <ArcShape2 {...props} startAngle={0} arcAngle={360} />
  : <Group>
      <ArcShape2 {...props} startAngle={0} arcAngle={180} />
      <ArcShape2 {...props} startAngle={180} arcAngle={180} />
    </Group>

const Pie = ({ series, colors, radius, innerRadius, backgroundColor ,series2, colors2, }) => {
  OFFSET = (radius - innerRadius) * 2
  const width = radius - innerRadius
  const backgroundPath = createPath(radius, radius, radius - width / 2, 0, 360)
  const backgroundPath2 = createPath(radius, radius, radius - width - 30 / 2, 0, 360)
  let startValue = 0
  let startValue2 = 0
   
  return (
    <Surface width={radius * 2} height={radius * 2}>
      <Group rotation={-90} originX={radius} originY={radius}>
        {/* <Shape
          d={backgroundPath}
          stroke={backgroundColor}
          strokeWidth={width}
        />
        <RingShape radius={radius} width={width} color={backgroundColor} /> */}
        {series.map((item, idx) => {
          const startAngle = startValue / 100 * 360
          const arcAngle = item / 100 * 360
          startValue += item
          const color = colors[idx]
          return arcAngle >= 360
            ? <RingShape
                key={idx}
                radius={radius}
                width={width}
                color={color}
              />
            : <ArcShape
                key={idx}
                radius={radius}
                width={width}
                color={color}
                startAngle={startAngle}
                arcAngle={arcAngle}
                strokeCap="butt"
              />
        })} 
      </Group>

      <Group rotation={-90} originX={radius} originY={radius}>
        {/* <Shape
          d={backgroundPath2}
          stroke={backgroundColor}
          strokeWidth={width}
        />
        <RingShape2 radius={radius - OFFSET} width={width} color={backgroundColor} /> */}
        {series2.map((item, idx) => {
          const startAngle = startValue2 / 100 * 360
          const arcAngle = item / 100 * 360
          startValue2 += item
          const color = colors2[idx]
          return arcAngle >= 360
            ? <RingShape2
                key={idx}
                radius={radius}
                width={width}
                color={color}
              />
            : <ArcShape2
                key={idx}
                radius={radius-OFFSET} 
                width={width}
                color={color}
                startAngle={startAngle}
                arcAngle={arcAngle}
                strokeCap="butt"
              />
         })} 
      </Group>
    </Surface>
  )
}

export default Pie

Pie.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  radius: PropTypes.number.isRequired,
  innerRadius: PropTypes.number,
  backgroundColor: PropTypes.string, 
  series2: PropTypes.arrayOf(PropTypes.number).isRequired,
  colors2: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Pie.defaultProps = {
  innerRadius: 0,
  backgroundColor: '#fff',
}
