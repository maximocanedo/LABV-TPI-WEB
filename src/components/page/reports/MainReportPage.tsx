'use strict';
import { useCurrentUser } from "src/components/users/CurrentUserContext";
import { PageContent } from "../commons/PageContent";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Header } from "../commons/Header";
import { Button } from "src/components/ui/button";
import { SearchIcon } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { Form } from "react-hook-form";

const data = [
    {
        name: 'Domingo',
        pv: 36,
    },
    {
        name: 'Lunes',
        pv: 19,
    },
    {
        name: 'Martes',
        pv: 29,
    },
    {
        name: 'Miercoles',
        pv: 59,
    },
    {
        name: 'Jueves',
        pv: 56,
    },
    {
        name: 'Viernes',
        pv: 80,
    },
    {
        name: 'Sabado',
        pv: 48,
    },
]

export const MainReportPage = () => {
    const { me, can } = useCurrentUser();
    return (
        <>
            <Header>Reportes</Header>
            <PageContent>
                <form>
                    <Label.Root className="LabelRoot" htmlFor="startDate">
                        Start Date
                    </Label.Root>
                    <input className="Input" type="date" id="startDate" />
                    <Label.Root className="LabelRoot" htmlFor="endDate">
                        End Date
                    </Label.Root>
                    <input className="Input" type="date" id="endDate" />
                    {/* <AppointmentStatusFilterControl></AppointmentStatusFilterControl> */}
                    <Button><SearchIcon />Buscar</Button>
                </form>
                <div className="flex justify-between gap-2 w-full">
                    <ResponsiveContainer width="50%" height={400}>
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={20}
                        >
                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </PageContent>
        </>
    )
}