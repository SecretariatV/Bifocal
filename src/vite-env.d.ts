/// <reference types="vite/client" />

declare module '@emotion/styled' {
  import styled from '@emotion/styled'
  export default styled
}

declare module 'recharts' {
  export const LineChart: any
  export const Line: any
  export const XAxis: any
  export const YAxis: any
  export const CartesianGrid: any
  export const Tooltip: any
  export const BarChart: any
  export const Bar: any
} 