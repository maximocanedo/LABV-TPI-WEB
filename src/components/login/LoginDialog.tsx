'use strict';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import * as users from "../../actions/users";
import {useEffect, useState} from "react";
import {useToast} from "../ui/use-toast";
import {CurrentUser} from "../../App";
import {Spinner} from "../form/Spinner";

interface LoginDialogProps {
    update: () => void;
    user: CurrentUser;
}

export const LoginDialog = ({ update }: any) => {
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ok, setOK] = useState(true);
    const [err, setErr] = useState("");
    const [valid, setValid] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const success = async () => {
        update();
    };

    useEffect(() => {
        if(username.trim() != "" && password.trim() != "") setValid(true);
        else setValid(false);
        setOK(true);
        setErr("");
    }, [username, password]);


    const tryLogin = async () => {
        setLoading(true);
        users.login(username, password)
            .then((res) => {
                setOK(res.ok);
                if(!res.ok) {
                    if(res.status == 401) setErr("Credenciales inválidas. ");
                    else setErr("Error desconocido. ");
                } else {
                    document.body.dispatchEvent(new Event("user-logged"));
                }
            }).catch(err => {
                setOK(false);
                if(err.path == "err/invalid-credentials") {
                    setErr("Credenciales inválidas");
                }
                console.log({err});
            }).finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Iniciar sesión</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">¡Bienvenido de nuevo!</DialogTitle>
                    <DialogDescription>
                        Iniciá sesión para continuar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Nombre de usuario</Label>
                            <Input
                                id="email"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder=""
                                required
                                disabled={loading}
                                className={""}
                            />
                            {(err.length > 0) && <span className={"text-sm text-destructive"}>{err}</span>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Contraseña</Label>
                            </div>
                            <Input
                                disabled={loading}
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required/>
                        </div>
                    <Button disabled={loading || !valid} onClick={tryLogin} type="submit" className="w-full">
                        { loading && <Spinner className={"p-1 m-1"} /> }
                        { loading ? "Ingresando" : "Iniciar sesión" }
                    </Button>
                </div>
                {!loading && <div className="mt-4 text-center text-sm">
                    ¿No tenés cuenta?
                    <a href="#" className=" mx-1 underline">
                        Creá una
                    </a>
                </div>}
            </DialogContent>
        </Dialog>
    );
};