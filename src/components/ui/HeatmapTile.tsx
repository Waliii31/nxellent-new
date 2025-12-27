import React from "react"

type HeatmapTileProps = {
  name: string
  score: number
  status: string
  background: string
  color: string
}

const HeatmapTile: React.FC<HeatmapTileProps> = ({
  name,
  score,
  status,
  background,
  color,
}) => {
  return (
    <div
      className="
        rounded-2xl px-6 py-5
        flex flex-col items-center justify-center
        text-center text-white
      "
      style={{
        background,
        boxShadow: "0px 0px 40px 0px #A855F733",
        border: "1px solid #A855F733",
      }}
    >
      <p className="urbanist text-base sm:text-lg font-medium mb-2">
        {name}
      </p>
      <p className="urbanist text-3xl font-semibold" style={{ color }}>
        {score}
      </p>
      <p className="inter text-sm mt-1">{status}</p>
    </div>
  )
}

export default HeatmapTile
