import './main-dashboard.css';
import event from '../../../assets/images/event1.png'


export default function Main_Dashboard() {
    return (
        <div className="main-content"> 
            <div className="main-layout">
                
                {/* LEFT SIDE: Stats and Charts */}
                <div className="left-area">
                    
                    {/* SUMMARY SECTION */}
                    <div className="summary">
                        <div className="summary-card residents-card">
                            <h4>Total Residents</h4>
                            <p>0</p>
                        </div>
                        <div className="summary-card applications-card">
                            <h4>Total Applications</h4>
                            <p>0</p>
                        </div>
                        <div className="summary-card officials-card">
                            <h4>Officials</h4>
                            <p>12</p>
                        </div>
                        <div className="summary-card announcements-card">
                            <h4>Announcements</h4>
                            <p>0</p>
                        </div>
                    </div>

                    {/* CHARTS SECTION */}
                    <div className="dashboard">
                        <div className="card">
                            <h3>Population</h3>
                            <div className="chart"></div>
                        </div>
                        <div className="card">
                            <h3>Age</h3>
                            <div className="chart"></div>
                        </div>
                        <div className="card">
                            <h3>Sector</h3>
                            <div className="chart"></div>
                        </div>
                        <div className="card">
                            <h3>Civil Status</h3>
                            <div className="chart"></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: News & Events */}
                <div className="right-area">
                    <h3 className="news-title">News & Events</h3>

                    <div className="news-card">
                        <img src={event} alt="event" />
                        <div className="news-info">
                            <h4>Barangay Assembly</h4>
                            <p>Community meeting at the Barangay Hall this Saturday.</p>
                            <span>July 15</span>
                        </div>
                    </div>

                    <div className="news-card">
                        <img src={event} alt="event" />
                        <div className="news-info">
                            <h4>Medical Mission</h4>
                            <p>Free health checkup for all residents.</p>
                            <span>July 20</span>
                        </div>
                    </div>

                    <div className="news-card">
                        <img src={event} alt="event" />
                        <div className="news-info">
                            <h4>Clean-up Drive</h4>
                            <p>Community clean-up drive this weekend.</p>
                            <span>July 25</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}