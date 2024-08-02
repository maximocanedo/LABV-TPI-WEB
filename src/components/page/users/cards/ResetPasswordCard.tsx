'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useEffect, useState} from "react";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {IUser, Permits} from "../../../../entity/users";
import {Input} from "../../../ui/input";
import {Label} from "../../../ui/label";
import { Button } from "../../../ui/button";
import * as users from "../../../../actions/users";
import {Spinner} from "../../../form/Spinner";
import {useToast} from "../../../ui/use-toast";
import {ToastAction} from "../../../ui/toast";
import {CommonException} from "../../../../entity/commons";

export interface ResetPasswordCardProps {
    user: IUser;
}

export const ResetPasswordCard = ({ user }: ResetPasswordCardProps) => {

    const { toast } = useToast();
    const { me, setCurrentUser } = useCurrentUser();

    const [ currentPassword, setCurrentPassword ] = useState<string>("");
    const [ cp, setCp ] = useState<string>("");
    const [ newPassword, setNewPassword ] = useState<string>("");
    const [ cnp, setCnp ] = useState<string>("");
    const [ rs, setRs ] = useState<string>("");
    const [ repeatNewPassword, setRepeatNewPassword ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);

    if(!user || !user.username || !user.name) return <></>;

    useEffect(() => {
        const upperRegex = /[A-ZÑÇ]/;
        const lowerRegex = /[a-zñç]/;
        const digitRegex = /[0-9]/;
        const specialRegex = /[#!?@$%^&*-]/;
        const minLengthRegex = /.{8,}/;

        const startsWithUpperCase: boolean = upperRegex.test(newPassword[0]);
        const hasLowerCaseLetter: boolean = lowerRegex.test(newPassword);
        const hasDigit: boolean = digitRegex.test(newPassword);
        const hasSpecialChar: boolean = specialRegex.test(newPassword);
        const minEightCharactersLong: boolean = minLengthRegex.test(newPassword);
        const hasAnyName: boolean = (user.name??"").trim().toLocaleUpperCase().split(" ").map(word => newPassword.toLocaleUpperCase().includes(word)).some(x=>x);
        const hasUsername: boolean = newPassword.toUpperCase().includes((user.username??"").toUpperCase());

        const isValid: boolean = [ startsWithUpperCase, hasLowerCaseLetter, hasDigit, hasSpecialChar, minEightCharactersLong, !hasAnyName, !hasUsername ].every((x: boolean) => x);
        if(!isValid) {
            if(newPassword.trim() == "") {
                setCnp("");
                return;
            }
            if(!startsWithUpperCase) {
                setCnp("Debe comenzar con mayúscula. ");
                return;
            }
            if(!hasLowerCaseLetter) {
                setCnp("Debe contener al menos una minúscula. ");
                return;
            }
            if(!hasDigit) {
                setCnp("Debe contener al menos un número. ");
                return;
            }
            if(!hasSpecialChar) {
                setCnp("Debe contener al menos un caracter especial. ");
                return;
            }
            if(!minEightCharactersLong) {
                setCnp("Debe tener al menos ocho caracteres. ");
                return;
            }
            if(hasAnyName) {
                setCnp("No puede tener tu nombre. ");
                return;
            }
            if(hasUsername) {
                setCnp("No puede tener tu nombre de usuario. ");
                return;
            }
        } else setCnp("");
        setRepeatNewPassword("");
    }, [ newPassword ]);

    useEffect(() => {
        if(repeatNewPassword === "" || newPassword === "") {
            setRs("");
            return;
        }
        if(newPassword === repeatNewPassword) {
            setRs("");
        } else setRs("Las contraseñas no coinciden. ");
    }, [ repeatNewPassword, newPassword ]);

    if(!me || me == "loading" || !user.active) return <></>;
    const canEdit: boolean = me.active && (me.username === user.username || (me.access??[]).some(x=>x===Permits.RESET_PASSWORD));
    if(!canEdit) return <></>;
    const itsMe = (): boolean => me.username === user.username;

    const update = (): void => {
        setLoading(true);
        const request: Promise<boolean> = itsMe() ? users.resetMyPassword(user.username, currentPassword, newPassword) : users.resetPassword(user.username, newPassword);
        request.then(updated => {
                if(updated) {
                    toast({
                        title: "Operación exitosa. ",
                        description: "Se cambió con éxito la contraseña de @" + user.username + ". "
                    });
                    setCurrentPassword("");
                    setNewPassword("");
                    setRepeatNewPassword("");
                } else {
                    toast({
                        variant: "destructive",
                        title: "Algo salió mal. ",
                        description: "Hubo un error desconocido al intentar cambiar la contraseña. ",
                        action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                    });
                }
            })
            .catch(err => {
                console.warn({err});
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar cambiar la contraseña. ",
                    action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                });
            })
            .finally(() => {
                    setLoading(false);
                });
    };

    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Cambiar contraseña</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                { itsMe() && (<>
                    <Label htmlFor={user.username+"$currentPasswordInput"}>Contraseña actual: </Label>
                    <Input disabled={!canEdit || loading} type={"password"} id={user.username+"$currentPasswordInput"} value={currentPassword} onChange={x=>setCurrentPassword(x.target.value)} />
                    { cp.trim() != "" && <span className="text-destructive text-xls">{cp}</span>}
                </>) }
                <Label htmlFor={user.username+"$newPassword"}>Nueva contraseña: </Label>
                <Input disabled={!canEdit || loading} type={"password"} id={user.username+"$newPassword"} value={newPassword} onChange={x=>setNewPassword(x.target.value)} />
                { cnp.trim() != "" && <span className="text-destructive text-xls">{cnp}</span>}
                { (cnp.trim() === "" && newPassword.trim().length > 0) && (<>
                    <Label htmlFor={user.username+"$repeatNewPassword"}>Repetir contraseña: </Label>
                    <Input disabled={!canEdit || loading} type={"password"} id={user.username+"$repeatNewPassword"} value={repeatNewPassword} onChange={x=>setRepeatNewPassword(x.target.value)} />
                </>) }
                { rs.trim() != "" && <span className="text-destructive text-xls">{rs}</span>}
                { (newPassword.trim().length > 0 && repeatNewPassword.trim().length > 0 && rs.trim() === "" && cnp.trim() === "")
                    && <div className="flex flex-1 justify-end">
                    <Button onClick={update} disabled={loading} variant={"default"}>{loading && <Spinner className={"mr-3"} />}{ loading ? "Cargando" : "Cambiar clave"}</Button>
                </div> }
            </div>
        </CardContent>
    </Card>);
};