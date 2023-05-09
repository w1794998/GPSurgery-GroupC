import Heading from '@govuk-react/heading';
import TopNav from '@govuk-react/top-nav';
import Button from '@govuk-react/button';
import Footer from '@govuk-react/footer';
import Select from '@govuk-react/select';
import { Label } from '@govuk-react/label';
import Input from '@govuk-react/input';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GovUKButtonNavigate from './Components/GOVUKButtonNavigate';
import GovUKTextLink from './Components/GOVUKTextLInk';
import { createContext } from 'react';
import './Layout.css';
import 'react-datepicker/dist/react-datepicker.css';
export const CurrentContext = createContext(null);

function Menu() {

    const Options = () => {
        return (
            <div>

                <TopNav />

                <fieldset>
                    <Heading> What are you looking for? </Heading>
                    <h2> Appointments </h2>
                    <GovUKButtonNavigate to="/book-app"> Book </GovUKButtonNavigate>
                    <br></br>
                    <GovUKButtonNavigate to="/view-app"> View </GovUKButtonNavigate>
                    <br></br>
                    <h2> Patient Records </h2>
                    <GovUKButtonNavigate> View </GovUKButtonNavigate>
                    <br></br>
                    <GovUKButtonNavigate> Update </GovUKButtonNavigate>
                    <br></br>
                    <h2> Medical Records </h2>
                    <GovUKButtonNavigate> View </GovUKButtonNavigate>
                    <br></br>
                    <GovUKButtonNavigate> Update </GovUKButtonNavigate>
                </fieldset>

                <Footer />

            </div>
        );
    };

    const BookApp = () => {
        const [selectedDate, setSelectedDate] = useState(null)
        const [selectedTime, setSelectedTime] = useState(null)
        const [descBox, setDesc] = useState(null)
        const [nhsNumber, setNHS] = useState(null);
        const [errors, setErrors] = useState({});
        const [isSubmitting, setIsSubmitting] = useState(false);

        //const navigate = useNavigate();

        const handleSubmit = async (event) => {
            event.preventDefault();
            setErrors(validate());
            setIsSubmitting(true);
        };

        const submitForm = useCallback(async () => {

            const data = {
                selectedDate,
                selectedTime,
                descBox,
                nhsNumber,
            };

            const formData = new FormData();
            formData.append('selectedDate', selectedDate);
            formData.append('selectedTime', selectedTime);
            formData.append('descBox', descBox);
            formData.append('nhsNumber', nhsNumber);

            const response = await fetch('http://localhost:4000/Appointment.php', {
                method: 'POST',
                //body: fData,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result);

            if (result.status === 'success') {
                GovUKButtonNavigate('/view-app');
            } else {
                alert(result.message);
            }
        }, [selectedDate, selectedTime, descBox, nhsNumber, GovUKButtonNavigate]);

        useEffect(() => {
            if (Object.keys(errors).length === 0 && isSubmitting) {
                submitForm();
                setIsSubmitting(false);
            }
        }, [errors, isSubmitting, submitForm]);



        const validate = () => {
            let errors = {};

            if (!selectedDate) {
                errors.selectedDate = "Date is required";
            }

            if (!selectedTime) {
                errors.selectedTime = "Time is required";
            }

            if (!descBox) {
                errors.descBox = "Description is required";
            }

            if (!nhsNumber) {
                errors.nhsNumber = "NHS number is required";
            } else if (!/^\d{10}$/.test(nhsNumber)) {
                errors.nhsNumber = "NHS number must be a 10-digit integer";
            }

            return errors;
        };

        return (
            <div>

                <TopNav serviceTitle="Book an Appointment" />

                <div className="backButton"><GovUKTextLink to="/"> Back </GovUKTextLink></div>

                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <Label htmlFor="nhsNumber"> NHS Number: </Label>
                        <Input
                            type="text"
                            name="nhsNumber"
                            id="nhsNumber"
                            value={nhsNumber}
                            onChange={(e) => setNHS(e.target.value)}
                        />
                        <br />
                        <p> Please select a date </p>
                        <Label htmlFor="Date"> Date </Label>
                        <DatePicker placeholderText="Choose a date"
                            name="selectedDate"
                            id="selectedDate"
                            value={selectedDate}
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat='dd/MM/yyyy'
                            minDate={new Date()}
                            filterDate={(date) => date.getDay() !== 0}
                        />
                        <br />
                        <p> Please select a time slot </p>
                        <Label htmlFor="Time"> Time </Label>
                        <Select
                            name="selectedTime"
                            id="selectedTime"
                            type="text"
                            value={selectedTime}
                            selected={selectedTime}
                            onChange={(time) => setSelectedTime(time)}>
                            <option>09:00</option>
                            <option>09:30</option>
                            <option>10:00</option>
                            <option>10:30</option>
                            <option>11:00</option>
                            <option>11:30</option>
                            <option>12:00</option>
                            <option>12:30</option>
                            <option>13:00</option>
                            <option>13:30</option>
                            <option>14:00</option>
                            <option>14:30</option>
                            <option>15:00</option>
                            <option>15:30</option>
                            <option>16:00</option>
                            <option>16:30</option>
                            <option>17:00</option>
                        </Select>
                        <br></br>
                        <Label htmlFor="descBox"> Briefly describe the reason for your appointment </Label>
                        <Input 
                            name="descBox" 
                            id="descBox" 
                            type="text" 
                            value={descBox} 
                            onChange={(e) => setDesc(e.target.value)} 
                        />
                        <br />
                        <br />
                        <GovUKButtonNavigate to="/view-app" > Submit </GovUKButtonNavigate>
                    </fieldset>
                </form>

                <Footer />

            </div>
        );
    };

    const ViewApp = () => {
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedTime, setSelectedTime] = useState('');
        const [descBox, setDesc] = useState('');
        const [nhsNumber, setNHS] = useState('');
        const [appointmentData, setAppointmentData] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:4000/ViewApp.php');
                    const data = await response.json();
                    setAppointmentData(data);
                } catch (error) {
                    console.error('Error fetching appointment data:', error);
                }
            };

            fetchData();
        }, []);

        const handleNHSNumberChange = (event) => {
            setNHS(event.target.value);
        };

        const handleSearch = () => {
            if (nhsNumber) {
                const appointment = appointmentData[nhsNumber];

                if (appointment) {
                    setSelectedDate(appointment.date);
                    setSelectedTime(appointment.time);
                    setDesc(appointment.description);
                } else {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setDesc(null);
                }
            }
        };

        return (
            <div>
                <TopNav serviceTitle="View Appointment" />

                <div className="backButton">
                    <GovUKTextLink to="/">Back</GovUKTextLink>
                </div>

                <fieldset>
                    <Label> NHS Number: </Label>
                    <Input
                        type="text"
                        name="nhsNumber"
                        id="nhsNumber"
                        value={nhsNumber}
                        onChange={handleNHSNumberChange}
                    />
                    <br />
                    <Label> Date: </Label>
                    {selectedDate && <span>{selectedDate}</span>}
                    <br />
                    <Label> Time: </Label>
                    {selectedTime && <span>{selectedTime}</span>}
                    <br />
                    <Label> Description: </Label>
                    {descBox && <span>{descBox}</span>}
                    <br />
                    <br />
                    <Button type="button" onClick={handleSearch}>Search</Button>
                    <GovUKButtonNavigate to="/Cancel-app">Cancel</GovUKButtonNavigate>
                </fieldset>

                <Footer />
            </div>
        );
    };

    const CancelApp = () => {
        return (
            <div>
                <TopNav />

                <div className="backButton"><GovUKTextLink to="/"> Back </GovUKTextLink></div>

                <fieldset className="canceled">
                    <Label>Your Appointment has been Cancelled!</Label>
                </fieldset>

                <Footer />
            </div>
        );
    };

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Options />} />
                    <Route path="/book-app" element={<BookApp />} />
                    <Route path="/view-app" element={<ViewApp />} />
                    <Route path="/cancel-app" element={<CancelApp />} />
                </Routes>
            </Router>
        </>
    );
}


export default Menu;
