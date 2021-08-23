import React, { useState } from "react"
import * as Konva from "react-konva"

function range(length: number) {
  return Array.from({ length }, (_, i) => i)
}

export const DragTable = () => {
  const [circles, setCircles] = useState([
    { x: 100, y: 200 },
    { x: 300, y: 100 },
    { x: 400, y: 300 }
  ])

  const setCircleItem = (index: number, item: any) => {
    setCircles(circles.map((v, i) => index === i ? item : v))
  }

  const [connectLines, setConnectLines] = useState([
    [{ x: 100, y: 100 }, { x: 200, y: 300 }, { x: 400, y: 200 }],
  ])

  const setConnectLinePoint = (index1: number, index2: number, item: any) => {
    setConnectLines(connectLines.map(
      (v1, i1) => i1 === index1 ? v1.map(
        (v2, i2) => i2 === index2 ? item : v2
      ) : v1)
    )
  }

  const space = 20

  return (
    <div className="flex flex-col items-center">
      <div>
        {JSON.stringify(circles)} <br />
        {JSON.stringify(connectLines)}
      </div>

      <Konva.Stage width={800} height={500}>
        <Konva.Layer>
          {range((800 / space) + 1).map(i => (
            <Line x1={i * space} y1={0} x2={i * space} y2={500} color="gray" key={i} />
          ))}

          {range((500 / space) + 1).map(i => (
            <Line x1={0} y1={i * space} x2={800} y2={i * space} color="gray" key={i} />
          ))}

          {circles.map((circle, index) => (
            <Circle
              x={circle.x}
              y={circle.y}
              r={10}
              color={"red"}
              onDragMove={(x, y) => {
                console.log("onDrag", x, y)

                const round = (n: number, b: number) => {
                  return Math.round(n / b) * b
                }

                const point = {
                  x: round(x, space), y: round(y, space)
                }

                if (circle.x !== point.x || circle.y !== point.y) {
                  console.log("SnapDrag")
                  setCircleItem(index, point)
                }

                return [point.x, point.y]
              }}
              onDragEnd={(x, y) => {
                console.log("onDragEnd", x, y)
              }}
              key={index}
            />
          ))}

          {connectLines.map((points, index) => (
            <ConnectLine
              points={points}
              onDragMove={(i, x, y) => {
                console.log("onDrag", x, y)

                const round = (n: number, b: number) => {
                  return Math.round(n / b) * b
                }

                const point = {
                  x: round(x, space), y: round(y, space)
                }

                if (points[i].x !== point.x || points[i].y !== point.y) {
                  console.log("SnapDrag")
                  setConnectLinePoint(index, i, point)
                }

                return [point.x, point.y]
              }}
              onDragEnd={(i, x, y) => {
                console.log("onDragEnd", x, y)
              }}
              key={index}
            />
          ))}
        </Konva.Layer>
      </Konva.Stage>
    </div>
  )
}

interface ConnectLineProps {
  points: { x: number, y: number }[]
  onDragStart?: (index: number, x: number, y: number) => void
  onDragMove?: (index: number, x: number, y: number) => [number, number] | void
  onDragEnd?: (index: number, x: number, y: number) => void
}

const ConnectLine = ({
  points, onDragStart, onDragMove, onDragEnd,
}: ConnectLineProps) => {
  const lines = range(Math.max(points.length - 1, 0)).map(i => ({
    x1: points[i].x, y1: points[i].y, x2: points[i + 1].x, y2: points[i + 1].y
  }))

  return (
    <>
      {lines.map((line, i) => (
        <Line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} key={i} color={"lightgreen"} />
      ))}

      {points.map((point, index) => (
        <Circle
          x={point.x}
          y={point.y}
          r={10}
          color={"green"}
          onDragStart={(x, y) => onDragStart?.(index, x, y)}
          onDragMove={(x, y) => onDragMove?.(index, x, y)}
          onDragEnd={(x, y) => onDragEnd?.(index, x, y)}
          key={index}
        />
      ))}
    </>
  )
}

interface LineProps {
  x1: number, y1: number, x2: number, y2: number, color?: string
  onDragStart?: (x: number, y: number) => void
  onDragMove?: (x: number, y: number) => [number, number] | void
  onDragEnd?: (x: number, y: number) => void
}

const Line = ({
  x1, y1, x2, y2, color, onDragMove, onDragEnd, onDragStart
}: LineProps) => {
  return (
    <Konva.Line
      points={[x1, y1, x2, y2]}
      stroke={color ?? "black"}
      strokeWidth={2}

      onDragMove={e => {
        const result = onDragMove?.(
          e.target.x(),
          e.target.y()
        )
        if (result) {
          e.target.x(result[0])
          e.target.y(result[1])
        }
      }}

      onDragStart={e => {
        onDragStart?.(e.target.x(), e.target.y())
      }}

      onDragEnd={e => {
        onDragEnd?.(e.target.x(), e.target.y())
      }}
    />
  )
}

interface CircleProps {
  x: number, y: number, r: number, color?: string
  onDragStart?: (x: number, y: number) => void
  onDragMove?: (x: number, y: number) => [number, number] | void
  onDragEnd?: (x: number, y: number) => void
}

const Circle = ({
  x, y, r, color, onDragMove, onDragEnd, onDragStart
}: CircleProps) => {
  return (
    <Konva.Circle
      x={x}
      y={y}
      radius={r}

      fill={color ?? "black"}
      draggable

      onDragMove={e => {
        const result = onDragMove?.(
          e.target.x(),
          e.target.y()
        )
        if (result) {
          e.target.x(result[0])
          e.target.y(result[1])
        }
      }}

      onDragStart={e => {
        onDragStart?.(e.target.x(), e.target.y())
      }}

      onDragEnd={e => {
        onDragEnd?.(e.target.x(), e.target.y())
      }}
    />
  )
}

export default DragTable