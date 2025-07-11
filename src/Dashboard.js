import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard({ contacts }) {
  // Count call results
  const resultCounts = contacts.reduce((acc, c) => {
    acc[c.result] = (acc[c.result] || 0) + 1
    return acc
  }, {})

  const labels = Object.keys(resultCounts)
  const data = {
    labels,
    datasets: [
      {
        label: 'Calls by Result',
        data: labels.map(l => resultCounts[l]),
        backgroundColor: '#2980b9',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Call Results Analytics' },
    },
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <Bar options={options} data={data} />
    </div>
  )
}
