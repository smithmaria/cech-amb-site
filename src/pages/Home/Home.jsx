import logo from '/CECH-Logo.png';
import './Home.css';
import ambGroup from '../../assets/images/ambassadors-group.png';
import headshot from '../../assets/images/maria-headshot.jpg';
import bingo from '../../assets/images/bingo.jpg';
 
 const Home = () => {
  return (
    <>
      <div className="landing-image">
        <img src={logo} alt="Logo" />
      </div>

      <div className='about-us'>
        <div className='about-us-container'>
          <h1>About Us</h1>
          <p>
            The Undergraduate Student Ambassador Program is a representation of the CECH student body. 
            This group actively engages in ongoing University and CECH events and programs and gives tours to prospective students. 
            Each Student Ambassador sees the campus through a student's eyes, which allows them to develop their leadership skills while supporting the college.
          </p>
          <p>
            The mission of the Student Ambassador Program is to cultivate student leaders who will share the CECH experience with prospective students, 
            their families, and community members. 
            Student Ambassadors create a positive and lasting impression thus enhancing the reputation of the college and university.
          </p>
          <div className='buttons'>
            <a className='button' href='/apply'>
              Apply
            </a>
            <a className='button' href='https://forms.office.com/Pages/ResponsePage.aspx?id=bC4i9cZf60iPA3PbGCA7Y_ItKi-BGElEjSj8Bm-kciVUNTZPRzdJSURPSjJMOTUzOENHRUhTUlhRSC4u' target='_blank' rel='noopener'>
              Request Ambassadors
            </a>
          </div>
        </div>
        <img src={ambGroup} alt='group of students standing in front of college' className='amb-group' />
      </div>

      <div className='contact'>
        <h1>Contact</h1>
        <div className='contact-container'>
          <div className='contact-item'>
            <img src={headshot} alt='headshot' />
            <div>
              <div className='contact-name'>Maria Smith</div>
              <div><i>President</i></div>
              <a href='mailto:smit9mt@mail.uc.edu'>smit9mt@mail.uc.edu</a>
            </div>
          </div>
          <div className='contact-item'>
            <img src={bingo} alt='headshot' />
            <div>
              <div className='contact-name'>Haley Fletcher</div>
              <div><i>Advisor</i></div>
              <a href='mailto:fletchhs@mail.uc.edu'>fletchhs@ucmail.uc.edu</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
 }

 export default Home;
