function transformInputArguments(jsonData) {
    if (jsonData.input_arguments && typeof jsonData.input_arguments === 'object') {
        const transformedArguments = Object.keys(jsonData.input_arguments).map(key => {
            const argument = jsonData.input_arguments[key];
            return {
                name: key,
                ...argument
            };
        });
        jsonData.input_arguments = transformedArguments;
    }
    return jsonData;
}

export default transformInputArguments;