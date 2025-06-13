// seu-projeto/components/Colors.tsx

export default {
    WHITE: "#fff",
    BG: "#F6F7F9",
    ORANGE: "#FC7100",
    GRAY: "#BEBEBE",
    TEXT_LIGHT: "#A1A1A1",
    BLACK: "#000",
    BRANCO_BTN_VOLTAR: "#FFFFFF25",
    PRETO_BG: "#00000025",
    INPUT_GRAY: "#EDEDED",
    RED: "#FF0000",
    GREEN: "#00FF00",

    SUNSET_GRADIENT: {
        colors: ['#fc5000', '#fc7100', '#fc9100' ] as const, // Usei um vermelho um pouco mais escuro
        // As transições são mais próximas do centro, deixando as bordas mais escuras
        locations: [0, 0.5, 1] as const,
        // Gradiente na diagonal, que costuma ficar mais orgânico
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
}