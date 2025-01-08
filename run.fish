function run_dev
    pnpm run dev &
    pnpm next dev &
    function cleanup --on-signal INT
        kill (jobs -p)
        exit
    end
    wait
end
run_dev
