// package com.example.backend.controller;

// import com.example.backend.model.Ticket;
// import com.example.backend.repo.CsvTicketRepo;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.beans.factory.annotation.Autowired;

// import java.time.Instant;
// import java.util.*;

// @RestController
// @RequestMapping("/tickets")
// public class TicketController {
//     @Autowired
//     private CsvTicketRepo repo;

//     @Value("${ai.service.url}")
//     private String aiUrl;

//     private RestTemplate rest = new RestTemplate();

//     @PostMapping
//     public ResponseEntity<?> create(@RequestBody Map<String,String> body) throws Exception {
//         Ticket t = new Ticket();
//         t.id = UUID.randomUUID().toString();
//         t.timestamp = Instant.now().getEpochSecond();
//         t.customer = body.getOrDefault("customer","guest");
//         t.category = body.getOrDefault("category","general");
//         t.question = body.getOrDefault("question","");
//         t.status = "Created";
//         t.botReply = "";
//         t.confidence = 0.0;
//         t.assignedAgent = "";

//         // append
//         repo.append(t);

//     // call AI
//     Map<String,String> payload = Map.of("text", t.question, "top_k", "3");
//     // normalize aiUrl to avoid double slashes
//     String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
//         // call python ai-service
//         Map response = null;
//         try {
//             response = rest.postForObject(aiBase + "/ai/query", Map.of("text", t.question, "top_k", 3), Map.class);
//             System.out.println("[TicketController] AI response: " + response);
//         } catch (Exception e) {
//             System.out.println("[TicketController] AI call failed: " + e.getMessage());
//         }

//         String best = null;
//         double conf = 0.0;
//         if (response != null) {
//             Object br = response.get("best_reply");
//             if (br instanceof String) best = (String) br;
//             Object c = response.get("confidence");
//             if (c instanceof Number) conf = ((Number)c).doubleValue();
//             else if (c instanceof String) {
//                 try { conf = Double.parseDouble((String)c); } catch (Exception ex) { conf = 0.0; }
//             }
//         } else {
//             System.out.println("[TicketController] AI returned null response for question: " + t.question);
//         }

//         if (best != null && conf >= 0.8) {
//             // mark resolved
//             repo.updateResolved(t.id, best, "bot"); 
//             t.status = "Resolved";
//             t.botReply = best;
//             t.confidence = conf;
//         } else {
//             t.status = "Pending";
//             t.botReply = best==null?"":best;
//             t.confidence = conf;
//         }
//         return ResponseEntity.ok(t);
//     }

//     @GetMapping
//     public ResponseEntity<?> list() throws Exception {
//         return ResponseEntity.ok(repo.findAll());
//     }

//     @PostMapping("/{id}/resolve")
//     public ResponseEntity<?> resolve(@PathVariable String id, @RequestBody Map<String,String> body) throws Exception {
//         String reply = body.getOrDefault("reply","");
//         String agent = body.getOrDefault("agent","human");
//         repo.updateResolved(id, reply, agent);
//         // send to AI memory to learn
//         String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
//         try {
//             rest.postForObject(aiBase + "/ai/add", Map.of("issue_text", body.getOrDefault("issue_text", "unknown"), "auto_reply", reply), Map.class);
//         } catch (Exception e) {
//             System.out.println("[TicketController] Failed to POST to AI /ai/add: " + e.getMessage());
//         }
//         return ResponseEntity.ok(Map.of("status","ok"));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<?> delete(@PathVariable String id) throws Exception {
//         boolean ok = repo.deleteById(id);
//         if (ok) return ResponseEntity.ok(Map.of("status","deleted"));
//         else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status","not_found"));
//     }

//     @PostMapping("/{id}/status")
//     public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String,String> body) throws Exception {
//         String status = body.getOrDefault("status","");
//         if (status.isEmpty()) return ResponseEntity.badRequest().body(Map.of("status","missing_status"));
//         boolean ok = repo.updateStatus(id, status);
//         if (ok) return ResponseEntity.ok(Map.of("status","updated","newStatus",status));
//         else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status","not_found"));
//     }
// }




























// package com.example.backend.controller;

// import com.example.backend.model.Ticket;
// import com.example.backend.repo.CsvTicketRepo;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.beans.factory.annotation.Autowired;

// import java.time.Instant;
// import java.util.*;

// @RestController
// @RequestMapping("/tickets")
// public class TicketController {

//     @Autowired
//     private CsvTicketRepo repo;

//     @Value("${ai.service.url}")
//     private String aiUrl;

//     private RestTemplate rest = new RestTemplate();

//     @PostMapping
//     public ResponseEntity<?> create(@RequestBody Map<String, String> body) throws Exception {
//         Ticket t = new Ticket();
//         t.id = UUID.randomUUID().toString();
//         t.timestamp = Instant.now().getEpochSecond();
//         t.customer = body.getOrDefault("customer", "guest");
//         t.category = body.getOrDefault("category", "general");
//         t.question = body.getOrDefault("question", "");
//         t.status = "Created";
//         t.botReply = "";
//         t.confidence = 0.0;
//         t.assignedAgent = "";

//         // Append ticket to CSV
//         repo.append(t);

//         // Call AI service
//         Map<String, Object> response = null;
//         String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
//         try {
//             response = rest.postForObject(
//                     aiBase + "/ai/query",
//                     Map.of("text", t.question, "top_k", 3),
//                     Map.class
//             );
//             System.out.println("[TicketController] AI response: " + response);
//         } catch (Exception e) {
//             System.out.println("[TicketController] AI call failed: " + e.getMessage());
//         }

//         String best = null;
//         double conf = 0.0;

//         if (response != null) {
//             Object br = response.get("best_reply");
//             if (br instanceof String) best = (String) br;

//             Object c = response.get("confidence");
//             if (c instanceof Number) conf = ((Number) c).doubleValue();
//             else if (c instanceof String) {
//                 try { conf = Double.parseDouble((String) c); } catch (Exception ex) { conf = 0.0; }
//             }
//         } else {
//             System.out.println("[TicketController] Null AI response for: " + t.question);
//         }

//         // -----------------------------
//         // ✨ Confidence classification logic
//         // -----------------------------
//         if (conf == 0.0) {
//             // fallback confidence simulation
//             String q = t.question.toLowerCase();
//             if (q.contains("sometimes") || q.contains("occasionally"))
//                 conf = 0.78;
//             else if (q.contains("cannot") || q.contains("fails"))
//                 conf = 0.82;
//             else if (q.contains("slow") || q.contains("delay"))
//                 conf = 0.70;
//             else
//                 conf = 0.65 + new Random().nextDouble() * 0.35; // random 65–100
//         }

//         // Ensure it’s capped to two decimals
//         conf = Math.round(conf * 100.0) / 100.0;

//         // -----------------------------
//         // ✨ Status handling based on confidence
//         // -----------------------------
//         if (best != null && conf >= 0.9) {
//             // High confidence → fully resolved
//             repo.updateResolved(t.id, best, "bot");
//             t.status = "Resolved";
//             t.botReply = best;
//         } else if (best != null && conf >= 0.7) {
//             // Medium confidence → partially resolved
//             t.status = "Partially Resolved";
//             t.botReply = best;
//         } else {
//             // Low confidence → pending
//             t.status = "Pending Review";
//             t.botReply = best == null ? "" : best;
//         }

//         t.confidence = conf;
//         return ResponseEntity.ok(t);
//     }

//     // -----------------------------
//     // List all tickets
//     // -----------------------------
//     @GetMapping
//     public ResponseEntity<?> list() throws Exception {
//         return ResponseEntity.ok(repo.findAll());
//     }

//     // -----------------------------
//     // Manual resolve (human)
//     // -----------------------------
//     @PostMapping("/{id}/resolve")
//     public ResponseEntity<?> resolve(@PathVariable String id, @RequestBody Map<String, String> body) throws Exception {
//         String reply = body.getOrDefault("reply", "");
//         String agent = body.getOrDefault("agent", "human");
//         repo.updateResolved(id, reply, agent);

//         // Send to AI for learning
//         String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
//         try {
//             rest.postForObject(
//                     aiBase + "/ai/add",
//                     Map.of("issue_text", body.getOrDefault("issue_text", "unknown"), "auto_reply", reply),
//                     Map.class
//             );
//         } catch (Exception e) {
//             System.out.println("[TicketController] Failed to POST to AI /ai/add: " + e.getMessage());
//         }

//         return ResponseEntity.ok(Map.of("status", "ok"));
//     }

//     // -----------------------------
//     // Delete ticket
//     // -----------------------------
//     @DeleteMapping("/{id}")
//     public ResponseEntity<?> delete(@PathVariable String id) throws Exception {
//         boolean ok = repo.deleteById(id);
//         if (ok) return ResponseEntity.ok(Map.of("status", "deleted"));
//         else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "not_found"));
//     }

//     // -----------------------------
//     // Update status
//     // -----------------------------
//     @PostMapping("/{id}/status")
//     public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) throws Exception {
//         String status = body.getOrDefault("status", "");
//         if (status.isEmpty()) return ResponseEntity.badRequest().body(Map.of("status", "missing_status"));
//         boolean ok = repo.updateStatus(id, status);
//         if (ok) return ResponseEntity.ok(Map.of("status", "updated", "newStatus", status));
//         else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "not_found"));
//     }
// }





package com.example.backend.controller;

import com.example.backend.model.Ticket;
import com.example.backend.repo.CsvTicketRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private CsvTicketRepo repo;

    @Value("${ai.service.url}")
    private String aiUrl;

    private RestTemplate rest = new RestTemplate();

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) throws Exception {
        Ticket t = new Ticket();
        t.id = UUID.randomUUID().toString();
        t.timestamp = Instant.now().getEpochSecond();
        t.customer = body.getOrDefault("customer", "guest");
        t.category = body.getOrDefault("category", "general");
        t.question = body.getOrDefault("question", "");
        t.status = "Created";
        t.botReply = "";
        t.confidence = 0.0;
        t.assignedAgent = "";

        // Append ticket to CSV
        repo.append(t);

        // Call AI service
        Map<String, Object> response = null;
        String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
        try {
            response = rest.postForObject(
                    aiBase + "/ai/query",
                    Map.of("text", t.question, "top_k", 3),
                    Map.class
            );
            System.out.println("[TicketController] AI response: " + response);
        } catch (Exception e) {
            System.out.println("[TicketController] AI call failed: " + e.getMessage());
        }

        String best = null;
        double conf = 0.0;

        if (response != null) {
            Object br = response.get("best_reply");
            if (br instanceof String) best = (String) br;

            Object c = response.get("confidence");
            if (c instanceof Number) conf = ((Number) c).doubleValue();
            else if (c instanceof String) {
                try { conf = Double.parseDouble((String) c); } catch (Exception ex) { conf = 0.0; }
            }
        }

        // Cap confidence to 0.0–1.0
        conf = Math.min(Math.max(conf / 100.0, 0.0), 1.0);

        // Update ticket status based on confidence
        if (best != null && conf >= 0.9) {
            t.status = "Resolved";
            t.botReply = best;
            t.confidence = conf;
            repo.updateResolved(t.id, best, "bot", conf);
        } else if (best != null && conf >= 0.7) {
            t.status = "Partially Resolved";
            t.botReply = best;
            t.confidence = conf;
        } else {
            t.status = "Pending Review";
            t.botReply = best == null ? "" : best;
            t.confidence = conf;
        }

        return ResponseEntity.ok(t);
    }

    @GetMapping
    public ResponseEntity<?> list() throws Exception {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable String id, @RequestBody Map<String, String> body) throws Exception {
        String reply = body.getOrDefault("reply", "");
        String agent = body.getOrDefault("agent", "human");
        double conf = 0.0;
        try {
            conf = Double.parseDouble(body.getOrDefault("confidence", "0.0"));
        } catch (NumberFormatException e) {
            conf = 0.0;
        }

        repo.updateResolved(id, reply, agent, conf);

        // Send to AI memory
        String aiBase = aiUrl == null ? "" : aiUrl.replaceAll("/+$", "");
        try {
            rest.postForObject(
                    aiBase + "/ai/add",
                    Map.of("issue_text", body.getOrDefault("issue_text", "unknown"), "auto_reply", reply),
                    Map.class
            );
        } catch (Exception e) {
            System.out.println("[TicketController] Failed to POST to AI /ai/add: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) throws Exception {
        boolean ok = repo.deleteById(id);
        if (ok) return ResponseEntity.ok(Map.of("status", "deleted"));
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "not_found"));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) throws Exception {
        String status = body.getOrDefault("status", "");
        if (status.isEmpty()) return ResponseEntity.badRequest().body(Map.of("status", "missing_status"));
        boolean ok = repo.updateStatus(id, status);
        if (ok) return ResponseEntity.ok(Map.of("status", "updated", "newStatus", status));
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "not_found"));
    }
}


















