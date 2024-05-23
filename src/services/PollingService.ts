class PollingService {
    public async getData() {
        // Lógica para obtener datos
        return { message: 'Short Polling Data' };
    }

    public async getLongPollingData() {
        // Lógica para long polling
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: 'Long Polling Data' });
            }, 5000);
        });
    }
}

export default new PollingService();