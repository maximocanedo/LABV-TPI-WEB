'use strict';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useEffect, useState} from "react";
import {countAppointmentsBySpecialtyMonthByMonth} from "../../../actions/appointments";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/chart";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {Specialty} from "../../../entity/specialties";
import {SpecialtyButtonSelector} from "../../dialog-selectors/specialty/SpecialtyButtonSelector";
import {Spinner} from "src/components/form/Spinner";
import {useCurrentUser} from "../../users/CurrentUserContext";

export interface ReportCountApposBySpecialtyProps {}

const chartConfig = {
    "TOTAL": {
        label: "Total Turnos",
        color: "hsl(221.2 83.2% 53.3%)",
    },
} satisfies ChartConfig;

export type SpanishMonth = "Enero" | "Febrero" | "Marzo" | "Abril" | "Mayo" | "Junio" | "Julio" | "Agosto" | "Septiembre" | "Octubre" | "Noviembre" | "Diciembre";

const months: SpanishMonth[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type ChartData = Array<{ month: SpanishMonth; TOTAL: number }>;

export const ReportCountApposBySpecialty = ({}: ReportCountApposBySpecialtyProps) => {
    const { me } = useCurrentUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [chartData, setChartData] = useState<ChartData>([]);

    const refresh = async () => {
        setLoading(true);

        if (!specialty) {
            setChartData([]);
            setLoading(false);
            return;
        }

        try {
            const result = await countAppointmentsBySpecialtyMonthByMonth(specialty);

            // Reformateamos los datos para encajar con los meses
            const data = months.map((month) => ({
                month,
                TOTAL: result?.[month] || 0, // Usa el valor directamente
            }));

            setChartData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [specialty]);

    return (
        <Card className={"card max-h-[360px]"}>
            <CardHeader>
                <CardTitle>Turnos</CardTitle>
                <CardDescription>Por especialidad</CardDescription>
            </CardHeader>
            {specialty &&<CardContent>
                 <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 16,
                            bottom: 8,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis/>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Line
                            dataKey="TOTAL"
                            type="monotone"
                            stroke={chartConfig["TOTAL"].color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>}
            <CardFooter className={"flex-row justify-between"}>
                <SpecialtyButtonSelector value={specialty} onChange={setSpecialty} nullable={false} />
                {loading && <Spinner className={"w-[24px] h-[24px] mr-2"} />}
            </CardFooter>
        </Card>
    );
};
