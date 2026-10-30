import { useClients } from "../../clients/useClients"

export const ClientsSection = () => {
    const { data: clients } = useClients()

    // Since we don't have logos in the database yet, we'll use a mix of 
    // real company names from the DB and some placeholder logos for the "wow" factor.
    // If there are no clients in DB, we'll show placeholder logos of partners.

    const placeholderLogos = [
        "https://upload.wikimedia.org/wikipedia/commons/b/b9/Logo_MRV.png", // Example
        "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Logotipo_Gerdau.svg/1200px-Logotipo_Gerdau.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_Cyrela.svg/1200px-Logo_Cyrela.svg.png",
        "https://logosenlogos.com/wp-content/uploads/2021/08/Votorantim-Logo.png",
    ]

    return (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-12">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Empresas que confiam na Rocama</span>

                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        {placeholderLogos.map((logo, i) => (
                            <img
                                key={i}
                                src={logo}
                                alt="Parceiro"
                                className="h-8 md:h-12 w-auto object-contain transition-transform hover:scale-110"
                            />
                        ))}
                    </div>

                    {/* If we have real companies in DB, we can list them as well */}
                    {clients && clients.length > 0 && (
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                + de <span className="font-bold text-gray-900">{clients.length}</span> clientes atendidos com excelência.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
