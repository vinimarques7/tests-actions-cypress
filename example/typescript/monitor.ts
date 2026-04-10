interface Site {
    nome: string;
    url: string;
}

const sites: Site[] = [
    { nome: 'Google', url: 'https://www.google.com' },
    { nome: 'GitHub', url: 'https://www.github.com' },
    { nome: 'Site Offline', url: 'https://sitequenaoexiste123456.com' }
];

async function verificarSite(site: Site): Promise<void> {
    try {
        await fetch(site.url);
        console.log(`${site.nome} está online`);
    } catch {
        console.log(`${site.nome} está offline`);
    }
}

async function monitorar(): Promise<void> {
    console.log('Verificando sites...\n');

    for (const site of sites) {
        await verificarSite(site);
    }

    console.log('\nMonitoramenteo concluído!')
}

monitorar();