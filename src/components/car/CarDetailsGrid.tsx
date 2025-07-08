'use client'

import { Gauge, Power, Fuel, CarFront } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CarDetailsGridProps {
  engineCapacity: string
  power: string
  fuelType: string
  type: string
}

export function CarDetailsGrid({
  engineCapacity,
  power,
  fuelType,
  type
}: CarDetailsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-0 mb-6">
      <Card className="shadow-none border-transparent">
        <CardContent className="flex items-center gap-3 p-4">
          <Gauge className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm text-muted-foreground">Engine</p>
            <p className="font-medium">{engineCapacity ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none border-transparent">
        <CardContent className="flex items-center gap-3 p-4">
          <Power className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm text-muted-foreground">Power</p>
            <p className="font-medium">{power ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none border-transparent">
        <CardContent className="flex items-center gap-3 p-4">
          <Fuel className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm text-muted-foreground">Fuel Type</p>
            <p className="font-medium">{fuelType ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none border-transparent">
        <CardContent className="flex items-center gap-3 p-4">
          <CarFront className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{type ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
