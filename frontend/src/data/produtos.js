const produtos = [
{
id: 1,
nome: "Mouse Gamer RGB",
categoria: "Periféricos",
preco: 129.90,
descricao: "Mouse gamer com iluminação RGB e alta precisão.",
imagem: "https://placehold.co/600x400?text=Mouse+Gamer"
},
{
id: 2,
nome: "Teclado Mecânico RGB",
categoria: "Periféricos",
preco: 249.90,
descricao: "Teclado mecânico RGB ideal para jogos e trabalho.",
imagem: "https://placehold.co/600x400?text=Teclado"
},
{
id: 3,
nome: "Monitor 24 Polegadas",
categoria: "Monitores",
preco: 899.90,
descricao: "Monitor Full HD de 24 polegadas.",
imagem: "https://placehold.co/600x400?text=Monitor"
},
{
id: 4,
nome: "Headset Gamer",
categoria: "Áudio",
preco: 199.90,
descricao: "Headset com microfone e áudio de alta qualidade.",
imagem: "https://placehold.co/600x400?text=Headset"
},
{
id: 5,
nome: "Webcam Full HD",
categoria: "Acessórios",
preco: 179.90,
descricao: "Webcam Full HD para reuniões e transmissões.",
imagem: "https://placehold.co/600x400?text=Webcam"
},
{
id: 6,
nome: "Mousepad Gamer",
categoria: "Acessórios",
preco: 79.90,
descricao: "Mousepad grande para setups gamer.",
imagem: "https://placehold.co/600x400?text=Mousepad"
},
{
id: 7,
nome: "Cadeira Gamer",
categoria: "Acessórios",
preco: 999.90,
descricao: "Cadeira confortável para longas sessões.",
imagem: "https://placehold.co/600x400?text=Cadeira"
},
{
id: 8,
nome: "SSD 1TB",
categoria: "Componentes",
preco: 459.90,
descricao: "SSD de 1TB para armazenamento rápido.",
imagem: "https://placehold.co/600x400?text=SSD"
}
];

// Estoques fictícios usados apenas na demonstração do frontend.
const estoques = [15, 8, 4, 12, 3, 20, 6, 10];
export default produtos.map((produto, indice) => ({ ...produto, estoque: estoques[indice] }));
