<template>
    <div class="become-member">
        <div class="content max-h-screen overflow-y-auto">
            <h1 class="text-3xl font-bold text-text1 mb-4">Bli medlem – Støtt Soppidentifikasjon.no!</h1>

            <p class="text-base text-text1-faded mb-6">
                Vil du bidra til å holde Soppidentifikasjon.no i drift og hjelpe flere med trygg soppplukking?
                Som medlem støtter du vårt arbeid med å dekke driftskostnader og honorarer til våre soppsakkyndige.
            </p>

            <h2 class="text-xl font-semibold text-text1 mb-2">Hvorfor bli medlem?</h2>
            <ul class="list-disc list-inside text-text1-faded mb-6 space-y-2">
                <li>🌱 <strong>Støtt driften</strong> – Bidra til vedlikehold av siden og vår gratis identifikasjonstjeneste.</li>
                <li>🍄 <strong>Lær mer om sopp</strong> – Få tilgang til eksklusivt innhold om soppidentifikasjon, matsopp og forvekslingsarter.</li>
                <li>🧐 <strong>Bli soppsakkyndig</strong> – Er du lidenskapelig opptatt av sopp? Medlemmer kan søke om å bli en del av vårt team av soppsakkyndige og hjelpe andre med trygg identifikasjon.</li>
            </ul>

            <h2 class="text-xl font-semibold text-text1 mb-2">Medlemskapstyper</h2>
            <ul class="list-disc list-inside text-text1-faded mb-6 space-y-2">
                <li>💛 <strong>Støttemedlem</strong> – Bidra økonomisk og få tilgang til medlemseksklusivt innhold.</li>
                <li>🔬 <strong>Soppsakkyndig medlem</strong> – For deg med erfaring og kunnskap, som ønsker å identifisere sopper for brukerne våre.</li>
            </ul>

            <p class="text-text1 font-medium mb-14">
                Sammen gjør vi soppidentifikasjon tryggere for alle!<br />
                Bli medlem i dag og støtt vårt arbeid.
            </p>

            <router-link
                to="/membership"
                class="btn-1 px-6 py-3 text-lg font-medium rounded-lg shadow hover:bg-button1-hover transition duration-300"
            >
                Meld deg inn her
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.content {
    padding: 1rem;
}
</style>