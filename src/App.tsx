import React, {useEffect, useState} from 'react';
import {User} from "./entity/users";
import * as users from "./actions/users";
import './globals.css';
import './output.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "./components/ui/button";
import {LoginButtonSection} from "./components/login/LoginButtonSection";
import {Toaster} from "./components/ui/toaster";
import Link from "./components/text/Link";
import {useToast} from "./components/ui/use-toast";
import {
    Bell, Github, Hospital,
    Package2
} from "lucide-react";
import {LateralMenu} from "./components/page/commons/LateralMenu";
import {MainUserPage} from "./components/page/users/MainUserPage";
import {CurrentUserProvider, useCurrentUser} from "./components/users/CurrentUserContext";
import {UserProfilePage} from "./components/page/users/UserProfilePage";
import {MainSpecialtyPage} from "./components/page/specialties/MainSpecialtyPage";
import {SpecialtyPage} from "./components/page/specialties/SpecialtyPage";
import {MainDoctorsPage} from "./components/page/doctors/MainDoctorsPage";
import { MainReportPage } from './components/page/reports/MainReportPage';
import {DoctorPage} from "./components/page/doctors/DoctorPage";
import { CreateSpecialtyPage } from './components/page/specialties/CreateSpecialtyPage';
import {SignupPage} from "./components/page/users/SignupPage";
import {SignDoctorPage} from "./components/page/doctors/SignDoctorPage";
import {PatientPage} from "./components/page/patients/PatientPage";
import {PatientsMainPage} from "./components/page/patients/PatientsMainPage";
import {SignPatientPage} from "./components/page/patients/SignPatientPage";
import {TestPage} from "./components/TestPage";
import {AppointPage} from "./components/page/appointments/AppointPage";
import {AppointmentPage} from "./components/page/appointments/AppointmentPage";
import {Appointments} from "./components/page/appointments/Appointments";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from './components/ui/dropdown-menu';

export type CurrentUser = User | null | "loading";

const App: React.FC = () => {
    const { me, setCurrentUser, loadCurrentUser } = useCurrentUser();


    return (
        <Router>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Hospital className="h-6 w-6"/>
                                <span className="">LABV-TPI</span>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                        <Github className="h-4 w-4"/>
                                        <span className="sr-only">Repositorios</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Repositorios</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {
                                        window.open("https://github.com/maximocanedo/LABV-TPI-WEB", "_blank")
                                    }}>
                                        Frontend
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        window.open("https://github.com/maximocanedo/LABV-TP4", "_blank")
                                    }}>
                                        API
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex-1">
                            <LateralMenu isInModal={false} />
                        </div>
                        <div className="mt-auto p-4">
                            <LoginButtonSection />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Routes>

                        <Route path={"/"} element={<></>}/>
                        <Route path={"/signup"} element={<SignupPage />} />

                        <Route path={"/users"} element={<MainUserPage />}/>
                        <Route path={"/users/:username"} element={<UserProfilePage />} />

                        <Route path={"/specialties"} element={<MainSpecialtyPage />} />
                        <Route path={"/specialties/new"} element={<CreateSpecialtyPage />} />
                        <Route path={"/specialties/:id"} element={<SpecialtyPage />} />

                        <Route path={"/doctors"} element={<MainDoctorsPage />} />
                        <Route path={"/doctors/new"} element={<SignDoctorPage />} />
                        <Route path={"/doctors/:file"} element={<DoctorPage />} />

                        <Route path={"/patients"} element={<PatientsMainPage />} />
                        <Route path={"/patients/new"} element={<SignPatientPage />} />
                        <Route path={"/patients/:id"} element={<PatientPage />} />

                        <Route path={"/appointments"} element={<Appointments />} />
                        <Route path={"/appointments/new"} element={<AppointPage />} />
                        <Route path={"/appointments/:id"} element={<AppointmentPage />} />

                        <Route path={"/reports"} element={<MainReportPage />} />
                        <Route path={"/test"} element={<TestPage />} />
                    </Routes>
                </div>
            </div>
            <Toaster/>
        </Router>
    );
};

export default App;
