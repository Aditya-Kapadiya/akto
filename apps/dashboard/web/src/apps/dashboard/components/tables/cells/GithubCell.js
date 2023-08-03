import {
    Text,
    Badge,
    VerticalStack,
    HorizontalStack,
    Icon,
    Box, Tooltip} from '@shopify/polaris';

function GithubCell(props){

    const {data, headers, getStatus, width} = props
    return (
    <HorizontalStack gap="1">
    {
        headers?.filter((header) => {
            return header.itemOrder==0
        }).map((header) => {
            return (
                <div style={{ marginBottom: "auto" }} key={header.value}>
                    <Box padding="05">
                        <Icon source={data[header.value]} color="primary" />
                    </Box>
                </div>
            )
        })
    }
    <VerticalStack gap="2" inlineAlign='baseline'>
        <HorizontalStack gap="2" align='start'>
            {
                headers?.filter((header) => {
                    return header.itemOrder == 1
                }).map((header) => {
                    if(header.component){
                        return (
                            <Box maxWidth={width} key={header.value}>
                                {header.component(data[header.value])}
                            </Box>
                        )
                    }
                    return (
                        <Box maxWidth={width} key={header.value}>
                            <Tooltip hoverDelay={800} content={data[header.value]} key={header.value} width='wide' preferredPosition='mostSpace'>
                                <Text as="span" variant="headingMd" truncate={true}>
                                    {data[header.value]}
                                </Text>
                            </Tooltip>
                        </Box>
                    )
                })
            }
            {
                headers?.filter((header) => {
                    return header.itemOrder==2
                }).map((header) => {
                    return data?.[header?.value]
                    ?.map((item) =>
                    <Badge key={item} status={getStatus(item)}>
                        {item}
                    </Badge>
                )}) 
            }
        </HorizontalStack>
        <HorizontalStack gap='2' align="start" >
            {
                headers?.filter((header) => {
                    return header.itemOrder==3
                }).map((header) => {
                    return (
                        <HorizontalStack key={header.value} gap="1">
                            <div style={{ maxWidth: "0.875rem", maxHeight: "0.875rem" }}>
                                <Icon source={header.icon} color="subdued" />
                            </div>
                            <Text as="div" variant="bodySm" color="subdued">
                                {data[header.value]}
                            </Text>
                        </HorizontalStack>
                    )
                }) 
            }
        </HorizontalStack>
    </VerticalStack>
</HorizontalStack>
)
}

export default GithubCell