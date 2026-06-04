import './main-dashboard.css';
import { useEffect, useState } from 'react'
import {PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell} from 'recharts';
import axios from 'axios';

export default function Main_Dashboard() {
    const [news, setNews] = useState([]);
    const [AgeData, setAgeData] = useState([]);
    const [GenderData, setGenderData] = useState([]);
    const [AppCount, setAppCount] = useState(0);
    const [ResCount, setResCount] = useState(0);
    const [NewsCount, setNewsCount] = useState(0);
    const colors1 = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const colors2 = ["#00BFFF", "#F4C2C2", "#FFFF00"];
    const fetchNews = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/news`);
                
                // Use the exact case from your Database/ERD
                const publishedNews = response.data
                    .filter(item => {
                        // Check for both casings just in case
                        const status = item.NewsStatus || item.newsstatus;
                        return status === "Published";
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.NewsPublished || a.createdat);
                        const dateB = new Date(b.NewsPublished || b.createdat);
                        return dateB - dateA;
                    });
                    
                setNews(publishedNews);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

    const fetchAgeData = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch/count-age`);
            const data = response.data;

            if(Array.isArray(data)){
                const formattedData = data.map((item) => ({
                    ...item,
                    name: item.age_group,
                    value: Number(item.value || item.count)
                }));

                setAgeData(formattedData);
            } else{ 
                setAgeData([]);
            }
        } catch (error) {
            console.log("Error Fetching Age Data", error);
        }
    };

     const fetchGenderData = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch/count-sex`);
            const data = response.data;

            if(Array.isArray(data)){
                const formattedData = data.map((item) => ({
                    ...item,
                    name: item.Sex,
                    value: Number(item.sex_count)
                }));

                setGenderData(formattedData);
            } else{ 
                setGenderData([]);
            }
        } catch (error) {
            console.log("Error Fetching Gender Data", error);
        }
    };

    const countApplicationData = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch/count-application`);
            const data = response.data;
            setAppCount(data[0].application_count);
        } catch (error) {
            console.log("Error Fetching Application Data", error);
        }
    };

     const countResidentData = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch/count-residents`);
            const data = response.data;
            setResCount(data[0].resident_count);
        } catch (error) {
            console.log("Error Fetching Resident Data", error);
        }
    };

     const countNewsData = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch/count-news`);
            const data = response.data;
            setNewsCount(data[0].news_count);
        } catch (error) {
            console.log("Error Fetching News Data", error);
        }
    };

    useEffect(() => { const loadData = async () => { await Promise.all([
        fetchAgeData(), fetchGenderData(), countApplicationData(), countResidentData(), countNewsData(), fetchNews()]);
    };
        loadData();
    }, []);

    return (
        <div className="main-content"> 
            <div className="main-layout">
                
                {/* LEFT SIDE: Stats and Charts */}
                <div className="left-area">
                    
                    {/* SUMMARY SECTION */}
                    <div className="summary">
                        <div className="summary-card residents-card">
                            <h4>Total Residents</h4>
                            <p>{ResCount}</p>
                        </div>
                        <div className="summary-card applications-card">
                            <h4>Total Applications</h4>
                            <p>{AppCount}</p>
                        </div>
                        <div className="summary-card officials-card">
                            <h4>Officials</h4>
                            <p>12</p>
                        </div>
                        <div className="summary-card announcements-card">
                            <h4>Announcements</h4>
                            <p>{NewsCount}</p>
                        </div>
                    </div>

                    {/* CHARTS SECTION */}
                    <div className="dashboard">
                        <div className="pieChart">
                        <h3 align="center">Age</h3>
                        <ResponsiveContainer width={375} height={375}>
                            <PieChart>
                                <Pie data = {AgeData} dataKey="value" nameKey="name"
                                cx='50%' cy='50%' outerRadius={120} label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {AgeData.map((entry, index) => (
                                        <Cell key={index} fill={colors1[index % colors1.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                        </div>
                        <div className="pieChart">
                        <h3 align="center">Gender</h3>
                        <ResponsiveContainer width={375} height={375}>
                            <PieChart>
                                <Pie data = {GenderData} dataKey="value" nameKey="name"
                                cx='50%' cy='50%' outerRadius={120} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {GenderData.map((entry, index) => (
                                        <Cell key={index} fill={colors2[index % colors2.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE: News & Events */}
               <div className="right-area">
                    <h3 className="news-title">News & Events</h3>

                    <div className="news-card">
                        {news.length > 0 ? (
                            news.map((item, index) => (
                                <div key={index} className="news-item">
                                    <img src={`http://localhost:3000/uploads/news/${item.NewsImage}`} alt="news" />
                                    <div className="news-info">
                                       <h4>
                            {item.NewsTitle.length > 45
                                ? item.NewsTitle.substring(0, 45) + "..."
                                : item.NewsTitle}
                        </h4>

                        <p>
                            {item.NewsContent.length > 100
                                ? item.NewsContent.substring(0, 100) + "..."
                                : item.NewsContent}
                        </p>

                        <span>
                            {new Date(item.NewsPublished).toLocaleDateString()}
                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No news available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}