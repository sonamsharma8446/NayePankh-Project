import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="container position-relative">
        <div class="row align-items-center min-vh-hero">
          <div class="col-lg-6">
            <div class="hero-badge mb-3">
              <span class="badge-dot"></span> Empowering Communities Since 2020
            </div>
            <h1 class="hero-title">
              Give Wings to <span class="text-gradient">Your Dreams</span> with NayePankh
            </h1>
            <p class="hero-subtitle">
              Join our mission to transform lives through education, technology, and community service. 
              Volunteer, intern, and make a real difference.
            </p>
            <div class="hero-actions">
              <a *ngIf="!authService.isLoggedIn" routerLink="/register" class="btn btn-hero-primary">
                <i class="bi bi-people-fill me-2"></i>Become a Volunteer
              </a>
              <a *ngIf="authService.isLoggedIn" [routerLink]="authService.isAdmin ? '/admin/dashboard' : '/volunteer/dashboard'" class="btn btn-hero-primary">
                <i class="bi bi-speedometer2 me-2"></i>Go to Dashboard
              </a>
              <a routerLink="/" class="btn btn-hero-outline ms-3">
                <i class="bi bi-play-circle me-2"></i>Learn More
              </a>
            </div>
            <div class="hero-stats mt-5">
              <div class="stat-item">
                <div class="stat-num">500+</div>
                <div class="stat-label">Volunteers</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num">50+</div>
                <div class="stat-label">Cities</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num">200+</div>
                <div class="stat-label">Internships</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num">1000+</div>
                <div class="stat-label">Lives Touched</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
            <div class="hero-visual">
              <div class="floating-card card-1">
                <i class="bi bi-award-fill text-warning"></i>
                <span>Certificate Awarded</span>
              </div>
              <div class="hero-emoji-grid">
                <div class="emoji-cell">🌱</div>
                <div class="emoji-cell">💻</div>
                <div class="emoji-cell">🤝</div>
                <div class="emoji-cell">🎓</div>
                <div class="emoji-cell">🏆</div>
                <div class="emoji-cell">🌍</div>
                <div class="emoji-cell">❤️</div>
                <div class="emoji-cell">⭐</div>
                <div class="emoji-cell">🚀</div>
              </div>
              <div class="floating-card card-2">
                <i class="bi bi-people-fill" style="color:#1a6b4a"></i>
                <span>500+ Active Volunteers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="section-about">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="about-visual">
              <div class="about-card-main">
                <div class="about-icon-lg">🌟</div>
                <h3>NayePankh Foundation</h3>
                <p>Registered NGO dedicated to youth empowerment and community development across India.</p>
                <div class="about-tags">
                  <span class="tag">Education</span>
                  <span class="tag">Technology</span>
                  <span class="tag">Community</span>
                </div>
              </div>
              <div class="about-card-side">
                <div class="side-stat">
                  <div class="side-num">4+</div>
                  <div class="side-label">Years Active</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="section-label">About Us</div>
            <h2 class="section-title">Transforming Youth, Transforming India</h2>
            <p class="section-text">
              NayePankh Foundation (meaning "New Wings") was founded with a singular vision: to empower youth 
              across India by providing access to technology education, mentorship, and real-world experience.
            </p>
            <p class="section-text">
              We connect passionate volunteers with meaningful internship opportunities, helping them build 
              skills while creating lasting impact in communities that need it most.
            </p>
            <div class="row g-3 mt-2">
              <div class="col-6">
                <div class="feature-box">
                  <i class="bi bi-mortarboard-fill feature-icon"></i>
                  <h6>Education First</h6>
                  <p class="small text-muted">Supporting learners at all stages</p>
                </div>
              </div>
              <div class="col-6">
                <div class="feature-box">
                  <i class="bi bi-code-slash feature-icon"></i>
                  <h6>Tech for Good</h6>
                  <p class="small text-muted">Bridging the digital divide</p>
                </div>
              </div>
              <div class="col-6">
                <div class="feature-box">
                  <i class="bi bi-heart-fill feature-icon"></i>
                  <h6>Community Care</h6>
                  <p class="small text-muted">Grassroots impact at scale</p>
                </div>
              </div>
              <div class="col-6">
                <div class="feature-box">
                  <i class="bi bi-trophy-fill feature-icon"></i>
                  <h6>Recognition</h6>
                  <p class="small text-muted">Certificates for every contribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section-mission">
      <div class="container">
        <div class="text-center mb-5">
          <div class="section-label">Our Purpose</div>
          <h2 class="section-title">Mission & Vision</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="mv-card mission">
              <div class="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To empower youth and underprivileged communities through technology, education, and sustainable development initiatives — creating a future where every individual has the wings to soar.</p>
              <ul class="mv-list">
                <li>Provide free technology education</li>
                <li>Create internship pathways for students</li>
                <li>Build a network of socially conscious volunteers</li>
                <li>Develop rural and urban communities equally</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mv-card vision">
              <div class="mv-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>A digitally empowered, equitable India where every young person — regardless of background — has access to the tools, mentorship, and opportunities to fulfill their potential.</p>
              <ul class="mv-list">
                <li>500+ cities covered by 2026</li>
                <li>10,000+ certified volunteers</li>
                <li>1 million lives positively impacted</li>
                <li>Self-sustaining community ecosystems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Internship Categories -->
    <section class="section-internships">
      <div class="container">
        <div class="text-center mb-5">
          <div class="section-label">Opportunities</div>
          <h2 class="section-title">Internship Programs</h2>
          <p class="text-muted">Gain real experience in cutting-edge domains</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4 col-sm-6" *ngFor="let cat of internshipCategories">
            <div class="internship-card">
              <div class="int-icon">{{cat.icon}}</div>
              <h5>{{cat.title}}</h5>
              <p class="text-muted small">{{cat.description}}</p>
              <div class="int-skills">
                <span *ngFor="let skill of cat.skills" class="skill-chip">{{skill}}</span>
              </div>
              <a *ngIf="authService.isLoggedIn" routerLink="/volunteer/internships" class="btn btn-int mt-3">Apply Now</a>
              <a *ngIf="!authService.isLoggedIn" routerLink="/register" class="btn btn-int mt-3">Join to Apply</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section-benefits">
      <div class="container">
        <div class="text-center mb-5">
          <div class="section-label">Why Join Us</div>
          <h2 class="section-title">Volunteer Benefits</h2>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" *ngFor="let benefit of benefits">
            <div class="benefit-card text-center">
              <div class="benefit-icon">{{benefit.icon}}</div>
              <h5>{{benefit.title}}</h5>
              <p class="text-muted small">{{benefit.desc}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="section-contact">
      <div class="container">
        <div class="contact-card">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <h2 class="text-white">Ready to Make a Difference?</h2>
              <p class="text-white-50">Join thousands of volunteers who are already creating positive change across India.</p>
              <div class="contact-info mt-4">
                <div class="ci-item">
                  <i class="bi bi-envelope-fill"></i>
                  <span>volunteers&#64;nayepankh.org</span>
                </div>
                <div class="ci-item">
                  <i class="bi bi-globe"></i>
                  <span>www.nayepankh.org</span>
                </div>
                <div class="ci-item">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span>Pan India — 50+ Cities</span>
                </div>
              </div>
            </div>
            <div class="col-lg-5 text-center text-lg-end mt-4 mt-lg-0">
              <a *ngIf="!authService.isLoggedIn" routerLink="/register" class="btn btn-contact-cta">
                Register Now <i class="bi bi-arrow-right ms-2"></i>
              </a>
              <a *ngIf="authService.isLoggedIn" [routerLink]="authService.isAdmin ? '/admin/dashboard' : '/volunteer/dashboard'" class="btn btn-contact-cta">
                Open Dashboard <i class="bi bi-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="np-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="footer-brand">🌟 NayePankh Foundation</div>
            <p class="text-muted mt-2 small">Giving wings to dreams. Empowering communities. Transforming India.</p>
          </div>
          <div class="col-lg-2 col-md-4">
            <h6 class="footer-heading">Platform</h6>
            <ul class="footer-links">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/login">Login</a></li>
              <li><a routerLink="/register">Register</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-4">
            <h6 class="footer-heading">Programs</h6>
            <ul class="footer-links">
              <li><a href="#">Internships</a></li>
              <li><a href="#">Volunteering</a></li>
              <li><a href="#">Certificates</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-4">
            <h6 class="footer-heading">Connect</h6>
            <div class="social-links">
              <a href="#" class="social-link"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="social-link"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="social-link"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 NayePankh Foundation. All rights reserved. Made with ❤️ for India.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .hero-section { background: linear-gradient(135deg, #f0faf5 0%, #e8f5ee 50%, #f8fcfa 100%); padding: 80px 0; overflow: hidden; position: relative; }
    .hero-bg { position: absolute; inset: 0; background: radial-gradient(circle at 70% 50%, rgba(26,107,74,0.05) 0%, transparent 60%); }
    .min-vh-hero { min-height: 70vh; }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(26,107,74,0.1); color: #1a6b4a; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a6b4a; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .hero-title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #1a1a1a; line-height: 1.2; margin-bottom: 20px; }
    .text-gradient { background: linear-gradient(135deg, #1a6b4a, #2d9d6e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-subtitle { font-size: 1.1rem; color: #555; line-height: 1.7; margin-bottom: 32px; }
    .btn-hero-primary { background: #1a6b4a; color: #fff; padding: 14px 28px; border-radius: 10px; font-weight: 600; border: none; transition: all 0.2s; }
    .btn-hero-primary:hover { background: #155a3d; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,107,74,0.3); }
    .btn-hero-outline { border: 2px solid #1a6b4a; color: #1a6b4a; padding: 12px 24px; border-radius: 10px; font-weight: 600; transition: all 0.2s; }
    .btn-hero-outline:hover { background: #1a6b4a; color: #fff; }
    .hero-stats { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
    .stat-item { text-align: center; }
    .stat-num { font-size: 1.8rem; font-weight: 800; color: #1a6b4a; }
    .stat-label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-divider { width: 1px; height: 40px; background: rgba(26,107,74,0.2); }
    .hero-visual { position: relative; display: flex; align-items: center; justify-content: center; height: 400px; }
    .hero-emoji-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .emoji-cell { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); transition: transform 0.3s; }
    .emoji-cell:hover { transform: scale(1.1) rotate(5deg); }
    .floating-card { position: absolute; background: white; border-radius: 12px; padding: 12px 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; }
    .floating-card.card-1 { top: 20px; right: 0; animation: float 3s ease-in-out infinite; }
    .floating-card.card-2 { bottom: 20px; left: 0; animation: float 3s ease-in-out infinite 1.5s; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

    .section-about, .section-internships, .section-benefits { padding: 100px 0; }
    .section-mission { padding: 100px 0; background: #f8fcfa; }
    .section-label { display: inline-block; color: #1a6b4a; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .section-title { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 800; color: #1a1a1a; margin-bottom: 16px; }
    .section-text { color: #555; line-height: 1.8; }

    .about-visual { position: relative; }
    .about-card-main { background: linear-gradient(135deg, #1a6b4a, #2d9d6e); color: white; padding: 32px; border-radius: 20px; }
    .about-icon-lg { font-size: 3rem; margin-bottom: 16px; }
    .about-card-main h3 { font-weight: 700; }
    .about-card-main p { opacity: 0.9; }
    .about-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
    .tag { background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }
    .about-card-side { position: absolute; bottom: -20px; right: -20px; background: white; padding: 20px 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); text-align: center; }
    .side-num { font-size: 2rem; font-weight: 800; color: #1a6b4a; }
    .side-label { font-size: 0.75rem; color: #888; }
    .feature-box { background: #f8fcfa; border: 1px solid rgba(26,107,74,0.1); border-radius: 12px; padding: 16px; }
    .feature-icon { font-size: 1.5rem; color: #1a6b4a; display: block; margin-bottom: 8px; }

    .mv-card { padding: 40px; border-radius: 20px; height: 100%; }
    .mv-card.mission { background: linear-gradient(135deg, #1a6b4a, #2d9d6e); color: white; }
    .mv-card.vision { background: white; border: 2px solid rgba(26,107,74,0.15); }
    .mv-card.vision h3, .mv-card.vision p, .mv-card.vision li { color: #333; }
    .mv-icon { font-size: 2.5rem; margin-bottom: 16px; }
    .mv-card h3 { font-weight: 700; margin-bottom: 12px; }
    .mv-card p { line-height: 1.7; opacity: 0.9; margin-bottom: 16px; }
    .mv-list { list-style: none; padding: 0; margin: 0; }
    .mv-list li { padding: 6px 0; }
    .mv-card.mission .mv-list li::before { content: "✓ "; }
    .mv-card.vision .mv-list li::before { content: "→ "; color: #1a6b4a; }

    .internship-card { background: white; border: 1px solid rgba(26,107,74,0.1); border-radius: 16px; padding: 28px; height: 100%; transition: all 0.3s; }
    .internship-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,107,74,0.12); border-color: rgba(26,107,74,0.3); }
    .int-icon { font-size: 2.5rem; margin-bottom: 12px; }
    .internship-card h5 { font-weight: 700; color: #1a1a1a; }
    .int-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .skill-chip { background: rgba(26,107,74,0.08); color: #1a6b4a; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .btn-int { background: rgba(26,107,74,0.08); color: #1a6b4a; border: none; border-radius: 8px; font-weight: 600; width: 100%; transition: all 0.2s; }
    .btn-int:hover { background: #1a6b4a; color: white; }

    .benefit-card { padding: 32px 20px; border-radius: 16px; background: white; border: 1px solid rgba(26,107,74,0.1); transition: all 0.3s; }
    .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,107,74,0.1); }
    .benefit-icon { font-size: 2.5rem; margin-bottom: 16px; }
    .benefit-card h5 { font-weight: 700; color: #1a1a1a; }

    .section-contact { padding: 80px 0; background: #f8fcfa; }
    .contact-card { background: linear-gradient(135deg, #1a6b4a, #0d4a30); border-radius: 24px; padding: 60px; }
    .contact-card h2 { font-weight: 800; }
    .ci-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); margin-bottom: 12px; }
    .ci-item i { color: rgba(255,255,255,0.6); font-size: 1.1rem; }
    .btn-contact-cta { background: white; color: #1a6b4a; border: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; transition: all 0.2s; }
    .btn-contact-cta:hover { background: #e8f5ee; transform: translateY(-2px); }

    .np-footer { background: #0f2417; color: #ccc; padding: 60px 0 0; }
    .footer-brand { font-size: 1.2rem; font-weight: 700; color: white; }
    .footer-heading { color: white; font-weight: 600; margin-bottom: 16px; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 8px; }
    .footer-links a { color: #aaa; text-decoration: none; transition: color 0.2s; font-size: 0.9rem; }
    .footer-links a:hover { color: #2d9d6e; }
    .social-links { display: flex; gap: 12px; }
    .social-link { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #ccc; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s; }
    .social-link:hover { background: #1a6b4a; color: white; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 40px; padding: 20px 0; text-align: center; color: #666; font-size: 0.85rem; }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  internshipCategories = [
    { icon: '🎨', title: 'Front End Development', description: 'Build beautiful, responsive web interfaces.', skills: ['Angular', 'React', 'CSS', 'Bootstrap'] },
    { icon: '⚡', title: 'Full Stack Development', description: 'End-to-end application development experience.', skills: ['MEAN', 'MERN', 'Node.js', 'MongoDB'] },
    { icon: '🔧', title: 'Backend Development', description: 'Build robust APIs and server-side applications.', skills: ['Node.js', 'Python', 'REST API'] },
    { icon: '🤖', title: 'Artificial Intelligence', description: 'Work on cutting-edge ML and AI projects.', skills: ['Python', 'TensorFlow', 'ML', 'NLP'] },
    { icon: '📊', title: 'Data Analytics', description: 'Transform raw data into meaningful insights.', skills: ['SQL', 'Tableau', 'Power BI', 'Excel'] }
  ];

  benefits = [
    { icon: '📜', title: 'Verified Certificates', desc: 'Get recognized certificates for all your contributions' },
    { icon: '💼', title: 'Real Experience', desc: 'Work on live projects with real-world impact' },
    { icon: '🌐', title: 'National Network', desc: 'Connect with volunteers across 50+ cities in India' },
    { icon: '🚀', title: 'Career Growth', desc: 'Boost your resume with NGO experience and references' }
  ];
}
