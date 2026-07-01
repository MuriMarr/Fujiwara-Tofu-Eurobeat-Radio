export default function Player() {
    return (
        <>
            <section id="player">
                <h2>Ouvir agora!</h2>
                <div className="player-box">
                    <DashboardPlayer />
                    <p>* Aguarde alguns instantes para a transmissão carregar.</p>
                </div>
            </section>
        </>
    );
}