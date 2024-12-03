'use strict';

import {DateRange} from "react-day-picker";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useEffect, useState} from "react";
import {subDays, subMonths} from "date-fns";
import {countAppointmentsInRange} from "../../../actions/appointments";
import {AppointmentStatus} from "../../../entity/appointments";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import {DatePickerWithRange} from "./DatePickerWithRange";
import { Spinner } from "src/components/form/Spinner";

export interface ReportCountApposByDayBetweenDatesProps {}

const chartConfig = {
    "PENDING": {
        label: "Pendientes",
        color: "hsl(221.2 83.2% 53.3%)",
    },
    "CANCELLED": {
        label: "Canc.",
        color: "#ff9800",
    },
    "PRESENT": {
        label: "Presentes",
        color: "#00e676",
    },
    "ABSENT": {
        label: "Aus.",
        color: "#f44336",
    },
} satisfies ChartConfig;

type Result = Record<string, number>;
type ChartData = Array<{ day: string } & Partial<Record<AppointmentStatus, number>>>;

export const ReportCountApposByDayBetweenDates = ({}: ReportCountApposByDayBetweenDatesProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [range, setRange] = useState<DateRange>({
        from: subDays(new Date(), 14),
        to: new Date()
    });
    const [chartData, setChartData] = useState<ChartData>([]);

    const refresh = async () => {
        setLoading(true);
        const statuses: AppointmentStatus[] = ["PENDING", "CANCELLED", "PRESENT", "ABSENT"];

        try {
            const results = await Promise.all(
                statuses.map(status => countAppointmentsInRange(status, range))
            );

            const combinedData: ChartData = Object.keys(results[0]).map(day => ({
                day: {"Domingo": "Dom", "Lunes": "Lun", "Martes": "Mar", "Miércoles": "Mié", "Jueves": "Jue", "Viernes": "Vie", "Sábado": "Sáb"}[day]??"",
                PENDING: results[0][day] || 0,
                CANCELLED: results[1][day] || 0,
                PRESENT: results[2][day] || 0,
                ABSENT: results[3][day] || 0,
            }));

            setChartData(combinedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [range]);

    return (
        <Card className={"card max-h-[330px]"}>
            <CardHeader>
                <CardTitle>Turnos</CardTitle>
                <CardDescription>Por día de semana</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className={"max-h-[180px] w-[100%]"} config={chartConfig}>
                    <BarChart className={"max-h-[180px] w-[100%]"} accessibilityLayer data={chartData}>
                        <CartesianGrid className={"max-h-[180px] w-[100%]"} vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {Object.keys(chartConfig).map((status, i) => (
                            <Bar
                                key={status}
                                dataKey={status}
                                stackId="a"
                                fill={chartConfig[status as AppointmentStatus].color}
                                radius={Object.keys(chartConfig).length == i+1 ? [4, 4, 0,0] : [ 0, 0, 0, 0 ]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className={"flex-row justify-between"}>
                <DatePickerWithRange disabled={loading} date={range} onChange={setRange} />
                {loading && <Spinner className={"w-[24px] h-[24px] mr-2"} />}
            </CardFooter>
        </Card>
    );
};
