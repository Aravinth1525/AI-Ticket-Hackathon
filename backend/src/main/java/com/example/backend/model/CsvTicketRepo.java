// package com.example.backend.repo;

// import com.example.backend.model.Ticket;
// import com.opencsv.*;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;
// import jakarta.annotation.PostConstruct;
// import java.io.*;
// import java.util.*;
// import java.util.stream.Collectors;

// @Component
// public class CsvTicketRepo {
//     @Value("${data.path:/data}")
//     private String dataPath;
//     private File ticketsFile;

//     @PostConstruct
//     public void init() throws IOException {
//         // resolve path and ensure directory exists
//         ticketsFile = new File(dataPath + "/tickets.csv");
//         File parent = ticketsFile.getAbsoluteFile().getParentFile();
//         if (!parent.exists()) {
//             boolean created = parent.mkdirs();
//             System.out.println("[CsvTicketRepo] Created data directory: " + parent.getAbsolutePath() + " -> " + created);
//         }
//         System.out.println("[CsvTicketRepo] tickets file resolved to: " + ticketsFile.getAbsolutePath());
//         if (!ticketsFile.exists()) {
//             try (CSVWriter writer = new CSVWriter(new FileWriter(ticketsFile,true))) {
//                 writer.writeNext(new String[] {"id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent"});
//             }
//             System.out.println("[CsvTicketRepo] Created tickets.csv with header at: " + ticketsFile.getAbsolutePath());
//         }
//     }

//     public synchronized void append(Ticket t) throws IOException {
//         try (CSVWriter writer = new CSVWriter(new FileWriter(ticketsFile,true))) {
//             writer.writeNext(new String[] {
//                 t.id,
//                 String.valueOf(t.timestamp),
//                 t.customer,
//                 t.category,
//                 t.question,
//                 t.status,
//                 t.botReply==null?"":t.botReply,
//                 String.valueOf(t.confidence),
//                 t.assignedAgent==null?"":t.assignedAgent
//             });
//         }
//     }

//     public synchronized List<Ticket> findAll() throws Exception {
//         try (CSVReader reader = new CSVReader(new FileReader(ticketsFile))) {
//             List<String[]> rows = reader.readAll();
//             if (rows.size() <= 1) return Collections.emptyList();
//             return rows.stream().skip(1).map(r -> {
//                 Ticket t = new Ticket();
//                 t.id = r[0]; t.timestamp = Long.parseLong(r[1]);
//                 t.customer = r[2]; t.category = r[3]; t.question = r[4];
//                 t.status = r[5]; t.botReply = r[6]; t.confidence = Double.parseDouble(r[7]);
//                 t.assignedAgent = r[8];
//                 return t;
//             }).collect(Collectors.toList());
//         }
//     }

//     public synchronized void updateResolved(String id, String reply, String agent) throws Exception {
//         List<Ticket> all = findAll();
//         for (Ticket t: all) {
//             if (t.id.equals(id)) {
//                 t.status = "Resolved";
//                 t.botReply = reply;
//                 t.assignedAgent = agent;
//                 t.confidence = 1.0;
//             }
//         }
//         // rewrite CSV
//         try (CSVWriter writer = new CSVWriter(new FileWriter(ticketsFile,false))) {
//             writer.writeNext(new String[] {"id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent"});
//             for (Ticket t: all) {
//                 writer.writeNext(new String[] {
//                     t.id,String.valueOf(t.timestamp),t.customer,t.category,t.question,t.status,t.botReply,String.valueOf(t.confidence),t.assignedAgent
//                 });
//             }
//         }
//     }

//     public synchronized boolean deleteById(String id) throws Exception {
//         List<Ticket> all = findAll();
//         List<Ticket> remaining = new ArrayList<>();
//         boolean removed = false;
//         for (Ticket t: all) {
//             if (t.id.equals(id)) {
//                 removed = true;
//                 continue;
//             }
//             remaining.add(t);
//         }
//         if (removed) {
//             try (CSVWriter writer = new CSVWriter(new FileWriter(ticketsFile,false))) {
//                 writer.writeNext(new String[] {"id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent"});
//                 for (Ticket t: remaining) {
//                     writer.writeNext(new String[] {
//                         t.id,String.valueOf(t.timestamp),t.customer,t.category,t.question,t.status,t.botReply,String.valueOf(t.confidence),t.assignedAgent
//                     });
//                 }
//             }
//         }
//         return removed;
//     }

//     public synchronized boolean updateStatus(String id, String status) throws Exception {
//         List<Ticket> all = findAll();
//         boolean changed = false;
//         for (Ticket t: all) {
//             if (t.id.equals(id)) {
//                 t.status = status;
//                 if (!"Resolved".equals(status)) {
//                     // clear bot reply/confidence when reopening
//                     t.botReply = "";
//                     t.confidence = 0.0;
//                 }
//                 changed = true;
//                 break;
//             }
//         }
//         if (changed) {
//             try (CSVWriter writer = new CSVWriter(new FileWriter(ticketsFile,false))) {
//                 writer.writeNext(new String[] {"id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent"});
//                 for (Ticket t: all) {
//                     writer.writeNext(new String[] {
//                         t.id,String.valueOf(t.timestamp),t.customer,t.category,t.question,t.status,t.botReply,String.valueOf(t.confidence),t.assignedAgent
//                     });
//                 }
//             }
//         }
//         return changed;
//     }
// }


package com.example.backend.repo;

import com.example.backend.model.Ticket;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Repository
public class CsvTicketRepo {

    private final String filePath = "tickets.csv";
    private final List<String> headers = List.of("id","timestamp","customer","category","question","status","botReply","confidence","assignedAgent");

    public CsvTicketRepo() throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            try (BufferedWriter bw = new BufferedWriter(new FileWriter(file))) {
                bw.write(String.join(",", headers));
                bw.newLine();
            }
        }
    }

    public synchronized void append(Ticket t) throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath, true))) {
            bw.write(String.join(",", Arrays.asList(
                    t.id,
                    String.valueOf(t.timestamp),
                    t.customer,
                    t.category,
                    t.question.replace(",", " "),
                    t.status,
                    t.botReply.replace(",", " "),
                    String.valueOf(t.confidence),
                    t.assignedAgent
            )));
            bw.newLine();
        }
    }

    public synchronized List<Ticket> findAll() throws IOException {
        List<Ticket> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line = br.readLine(); // skip headers
            while ((line = br.readLine()) != null) {
                String[] cols = line.split(",", -1);
                if (cols.length < headers.size()) continue;

                Ticket t = new Ticket();
                t.id = cols[0];
                try { t.timestamp = Long.parseLong(cols[1]); } catch (NumberFormatException e) { t.timestamp = 0; }
                t.customer = cols[2];
                t.category = cols[3];
                t.question = cols[4];
                t.status = cols[5];
                t.botReply = cols[6];

                // Safe confidence parsing
                try { t.confidence = Double.parseDouble(cols[7]); }
                catch (NumberFormatException e) { t.confidence = 0.0; }

                t.assignedAgent = cols[8];
                list.add(t);
            }
        }
        return list;
    }

    public synchronized boolean updateResolved(String id, String reply, String agent, double confidence) throws IOException {
        List<Ticket> tickets = findAll();
        boolean found = false;
        for (Ticket t : tickets) {
            if (t.id.equals(id)) {
                t.botReply = reply;
                t.assignedAgent = agent;
                t.confidence = confidence;
                t.status = "Resolved";
                found = true;
                break;
            }
        }
        if (found) saveAll(tickets);
        return found;
    }

    public synchronized boolean updateStatus(String id, String status) throws IOException {
        List<Ticket> tickets = findAll();
        boolean found = false;
        for (Ticket t : tickets) {
            if (t.id.equals(id)) {
                t.status = status;
                found = true;
                break;
            }
        }
        if (found) saveAll(tickets);
        return found;
    }

    public synchronized boolean deleteById(String id) throws IOException {
        List<Ticket> tickets = findAll();
        boolean removed = tickets.removeIf(t -> t.id.equals(id));
        if (removed) saveAll(tickets);
        return removed;
    }

    private void saveAll(List<Ticket> tickets) throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filePath))) {
            bw.write(String.join(",", headers));
            bw.newLine();
            for (Ticket t : tickets) {
                bw.write(String.join(",", Arrays.asList(
                        t.id,
                        String.valueOf(t.timestamp),
                        t.customer,
                        t.category,
                        t.question.replace(",", " "),
                        t.status,
                        t.botReply.replace(",", " "),
                        String.valueOf(t.confidence),
                        t.assignedAgent
                )));
                bw.newLine();
            }
        }
    }
}

