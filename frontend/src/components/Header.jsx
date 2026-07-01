export default function Header() {
    return (
        <>
            <header>
                <div className="logo">
                    <img src="/images/tofu-fujiwara-eurobeat-radio.png" alt="logo"
                        style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "5px" }} />
                </div>

                <div className="header-right">
                    <nav className="nav">
                        <ul>
                            <li>
                                <button onClick={toggleTheme} className="theme-toggle">🌓</button>
                            </li>
                            <li><a href="#sobre">Sobre</a></li>
                            <li><a href="#player">Ouvir</a></li>
                            <li><a href="#contato">Contato</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
