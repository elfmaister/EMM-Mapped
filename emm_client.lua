if not timer.Exists("EMM_ClientTracker") then
		print("Doesn't exist lets set it up for", ply:Nick())
		timer.Create("EMM_ClientTracker", 0.1, 0, function()
			if not ply:IsValid() then return end
			local pos = ply:GetPos()
			local vel = ply:GetVelocity()
			local ang = ply:EyeAngles()
			local data = {
				name = ply:Nick(),
				x = pos.x,
				y = pos.y,
				z = pos.z,
				vel = vel:Length(),
				pitch = ang.p,
				yaw = ang.y,
				roll = ang.r,
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
		print("Timer Successfully created for", ply:Nick())
	end
