export function toggleResponse(messageService, data) {
    if (data.status === 200) {
        messageService.showMessage({
            timeout: 2000,
            type: "success",
            title: data.message,
            body: data?.details,
        });
    } else {
        messageService.showMessage({
            timeout: 2000,
            type: "error",
            title: data.message,
            body: data?.details,
        });
    }
}
