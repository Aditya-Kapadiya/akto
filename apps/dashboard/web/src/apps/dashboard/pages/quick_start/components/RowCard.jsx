import { Avatar, Button, Card, HorizontalGrid, Text, VerticalStack, HorizontalStack, Badge } from '@shopify/polaris';

function RowCard(props) {

    const {cardObj, onButtonClick, buttonText} = props ;
    const goToDocs = () => {
        window.open(cardObj.docsUrl)
    }

    const handleAction = () => {
        onButtonClick(cardObj)
    }

    return (
        <Card>
            <VerticalStack gap="5">
                <HorizontalStack gap="2">
                    <Avatar customer size="small" name={cardObj.label} source={cardObj.icon}/>
                    {cardObj.badge ? <Badge size='small' status='info'>{cardObj.badge}</Badge> : null}
                </HorizontalStack>
                <VerticalStack gap="1">
                    <Text variant="headingMd" as="h5">{cardObj.label}</Text>
                    <Text variant="bodyMd">{cardObj.text}</Text>
                </VerticalStack>

                <HorizontalGrid columns={4} gap="1">
                    <Button onClick={handleAction}>{buttonText}</Button>
                    <Button plain onClick={goToDocs}>See Docs</Button>
                </HorizontalGrid>
            </VerticalStack>
            
        </Card>
    )
}

export default RowCard