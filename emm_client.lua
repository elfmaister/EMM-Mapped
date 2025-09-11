if not timer.Exists("EMM_ClientTracker") then
    timer.Create("EMM_ClientTracker", 0.1, 0, function()
        local ply = LocalPlayer()
        if not ply:IsValid() then return end
        local pos = ply:GetPos()
        local vel = ply:GetVelocity()
        local data = {
            name = ply:Nick(),
            x = pos.x,
            y = pos.y,
            z = pos.z,
            vel_len = vel:Length(),
            vel_dir = math.atan2(vel.y, vel.x)
        }
        local jsonData = util.TableToJSON(data)
        print("[EMM Client] Sending data: " .. jsonData)
        http.Post("https://emm-mapped.onrender.com/data",
            { data = jsonData }, -- Send as form-encoded
            function(body) print("[EMM Client] Data sent, response: " .. body) end,
            function(err) print("[EMM Client] Error: " .. err) end,
            { ["Content-Type"] = "application/x-www-form-urlencoded" }
        )
    end)
end