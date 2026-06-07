export async function getDocumentType() {
    
    const response = await fetch("/../../data/selects/documentTypes.json")

    return response.json();
}