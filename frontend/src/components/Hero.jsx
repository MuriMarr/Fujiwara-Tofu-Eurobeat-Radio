export default function Hero() {
    return (
        <>
            <section id="hero">
                <div className='hero-layer active'
                    style={{ backgroundImage: `url(${images[currentBg]})` }} />

                <h1>Bem-vindo à Rádio Tofu de Fujiwara!</h1>
                <p>A primeira e melhor rádio de Eurobeat do Brasil!</p>
                <a href="#player" className="btn">Ouça Agora</a>
            </section>
        </>
    );
}