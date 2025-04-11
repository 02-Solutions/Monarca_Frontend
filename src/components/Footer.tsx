function Footer() {
    return (
        <footer className="w-full bg-[var(--dark-blue)] text-[var(--white)]">
            <div className="max-w-screen-xl mx-auto p-5 flex justify-between items-center text-xs">
                <p>Copyright © {new Date().getFullYear()} 02 Solutions.</p>
                <p>All Rights Reserved | Terms and Conditions | Privacy Policy</p>
            </div>
        </footer>
    )
}

export default Footer;