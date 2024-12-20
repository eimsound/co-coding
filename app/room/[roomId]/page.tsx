import CollaborativeEditor from '@/components/CollaborativeEditor'

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <CollaborativeEditor roomId={roomId} />
        </main>
    )
}
