import { motion } from 'framer-motion'
import { Lock, CheckCircle, Circle } from 'lucide-react'

// Layout utility: place nodes in a staggered grid 
function getNodePosition(index, total) {
  const cols = Math.min(total, 3)
  const row  = Math.floor(index / cols)
  const col  = index % cols
  const xStep = 220
  const yStep = 110
  const offsetX = col * xStep + (row % 2) * (xStep / 2)
  const offsetY = row * yStep
  return { x: 40 + offsetX, y: 40 + offsetY }
}

function QuestNode({ node, index, total, onClick }) {
  const pos   = getNodePosition(index, total)
  const isCompleted = node.status === 'COMPLETED'
  const isLocked    = node.status === 'LOCKED'
  const isAvail     = node.status === 'AVAILABLE' || node.status === 'IN_PROGRESS'

  const ringColor = isCompleted ? '#10B981' : isAvail ? '#8B5CF6' : '#374151'
  const textColor = isCompleted ? 'text-emerald-400' : isAvail ? 'text-lavender' : 'text-starlight-dim'
  const bgColor   = isCompleted ? 'bg-emerald-500/20 border-emerald-500/40' : isAvail ? 'bg-purple-glow/20 border-purple-glow/40' : 'bg-white/5 border-white/10'

  return (
    <motion.g
      onClick={() => isAvail && onClick && onClick(node)}
      style={{ cursor: isAvail ? 'pointer' : 'default' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={isAvail ? { scale: 1.06 } : {}}
    >
      {/* Glow ring for available */}
      {isAvail && (
        <motion.circle
          cx={pos.x} cy={pos.y} r={28}
          fill="none" stroke={ringColor} strokeWidth={2} opacity={0.4}
          animate={{ r: [28, 34, 28] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Node circle */}
      <circle cx={pos.x} cy={pos.y} r={24} fill={isCompleted ? 'rgba(16,185,129,0.15)' : isAvail ? 'rgba(139,92,246,0.2)' : 'rgba(30,27,75,0.6)'} stroke={ringColor} strokeWidth={isAvail ? 2 : 1.5} />

      {/* Status icon */}
      {isCompleted && (
        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="14" fill="#10B981">✓</text>
      )}
      {isLocked && (
        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="#6B7280">🔒</text>
      )}
      {isAvail && (
        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="#8B5CF6">⚔</text>
      )}

      {/* Label */}
      <foreignObject x={pos.x - 55} y={pos.y + 28} width={110} height={32}>
        <div className="text-center">
          <p className={`text-[10px] font-medium leading-tight ${textColor} line-clamp-2`} xmlns="http://www.w3.org/1999/xhtml">
            {node.nodeName}
          </p>
        </div>
      </foreignObject>
    </motion.g>
  )
}

export default function QuestMapView({ mainQuest, onNodeClick }) {
  if (!mainQuest || !mainQuest.nodes?.length) return null

  const nodes  = [...mainQuest.nodes].sort((a, b) => a.stepOrder - b.stepOrder)
  const cols   = Math.min(nodes.length, 3)
  const rows   = Math.ceil(nodes.length / cols)
  const svgW   = 40 + cols * 220 + 80
  const svgH   = 40 + rows * 110 + 80

  // Build path lines between sequential nodes
  const paths = nodes.slice(1).map((node, i) => {
    const from = getNodePosition(i, nodes.length)
    const to   = getNodePosition(i + 1, nodes.length)
    const done = node.status === 'COMPLETED' || nodes[i].status === 'COMPLETED'
    return { from, to, done }
  })

  return (
    <div className="overflow-x-auto no-scrollbar rounded-2xl">
      <svg
        width={svgW} height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="min-w-full"
        aria-label={`Quest map for ${mainQuest.title}`}
      >
        {/* Connection paths */}
        {paths.map((p, i) => (
          <motion.line
            key={i}
            x1={p.from.x} y1={p.from.y}
            x2={p.to.x}   y2={p.to.y}
            stroke={p.done ? '#10B981' : 'rgba(139,92,246,0.3)'}
            strokeWidth={2}
            strokeDasharray={p.done ? 'none' : '6 4'}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <QuestNode
            key={node.id}
            node={node}
            index={i}
            total={nodes.length}
            onClick={onNodeClick}
          />
        ))}
      </svg>
    </div>
  )
}
