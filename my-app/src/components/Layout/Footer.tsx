export default function Footer() {
  return (
    <>
      <div className="site-footer">
        <div className="site-footer-links">
          <span>Home</span>
          <span>Disclaimer</span>
          <span>Privacy Policy</span>
          <span>Contact Us</span>
          <span>Accessibility</span>
          <span>Sitemap</span>
        </div>
        &copy; {new Date().getFullYear()} CrimeGPT &mdash; Ministry of Home Affairs, Government of India &nbsp;|&nbsp; All
        Rights Reserved &nbsp;|&nbsp; v2.0 &nbsp;|&nbsp; NIC Hosted
      </div>
      <div className="footer-strip" />
    </>
  );
}
