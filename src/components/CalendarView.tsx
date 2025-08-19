import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Users, Settings } from "lucide-react";
import { EnhancedCalendarView } from "./EnhancedCalendarView";

interface CalendarViewProps {
  tasks: any[];
}

const CalendarView = ({ tasks }: CalendarViewProps) => {
  const [showEnhanced, setShowEnhanced] = useState(true);

  if (showEnhanced) {
    return <EnhancedCalendarView tasks={tasks} />;
  }

  // Fallback to basic calendar view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendar View</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowEnhanced(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Enhanced View
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Compliance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square border rounded-lg p-2 hover:bg-accent cursor-pointer">
                <div className="text-sm">{((i % 31) + 1)}</div>
                {i % 7 === 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    GST
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;