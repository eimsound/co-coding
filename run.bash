function run_dev {
    source .env
    pnpm run dev &
    pnpm next dev -H $FRONTEND_HOST -p $FRONTEND_PORT &

    trap 'kill $(jobs -p); exit' INT
    wait
}

run_dev
