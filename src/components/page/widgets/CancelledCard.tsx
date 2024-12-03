'use strict';
import {countCancelledByYear, LessThanOneHundred, YearBetween1900And2099} from "../../../actions/appointments";
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Input} from "../../ui/input";
import {Spinner} from "../../form/Spinner";

export const CancelledCard = () => {
    const def: YearBetween1900And2099 = new Date().getFullYear()+"" as YearBetween1900And2099;
    const [ year, setYear ] = useState<YearBetween1900And2099>(def);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ count, setCount ] = useState<string>("");

    const refresh = () => {
        setLoading(true);
        countCancelledByYear(year)
            .then((x) => {
                setCount(x + "");
            })
            .catch(console.error)
            .finally(() => {setLoading(false); });
    };

    useEffect(refresh, [ year ])


    return <Card className={"card"}>
        <CardHeader>
            <CardTitle>Turnos cancelados</CardTitle>
            <CardDescription>En el año {year}. </CardDescription>
        </CardHeader>
        {!loading && <CardContent>
            <h1 className={"text-6xl text-center"}>{count}</h1>
        </CardContent>}
        <CardFooter className={"flex-row justify-between"}>
            <Input
                type={"number"}
                value={year}
                min={1900}
                max={2099}
                onChange={(e) => setYear(e.target.value as YearBetween1900And2099)}
            />
            {loading && <Spinner className={"w-[24px] h-[24px] mx-2"} />}
        </CardFooter>
    </Card>

};